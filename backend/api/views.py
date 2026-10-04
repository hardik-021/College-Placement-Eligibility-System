from django.shortcuts import get_object_or_404
from django.db.models import Count, Q, Avg, Max
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import CustomUser, StudentProfile, Company, Application, Notification
from .serializers import (
    UserSerializer, StudentProfileSerializer, CompanySerializer, 
    ApplicationSerializer, NotificationSerializer
)
from .utils import calculate_eligibility_score

# Helper custom permission for Admin only
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'

# Helper custom permission for Admin or Placement Officer
class IsAdminOrOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'OFFICER']

# Permission helper for Owner or Admin/Officer
class IsOwnerOrAdminOrOfficer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role in ['ADMIN', 'OFFICER']:
            return True
        # If it's a StudentProfile
        if isinstance(obj, StudentProfile):
            return obj.user == request.user
        # If it's an Application
        if isinstance(obj, Application):
            return obj.student.user == request.user
        return False

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        enrollment_number = request.data.get('enrollment_number')

        user = None

        if enrollment_number:
            # Student Login Flow
            try:
                profile = StudentProfile.objects.get(enrollment_number=enrollment_number)
                user = authenticate(username=profile.user.username, password=password)
            except StudentProfile.DoesNotExist:
                return Response({'error': 'No student found with this enrollment number.'}, status=status.HTTP_400_BAD_REQUEST)
        elif username:
            # Admin / Officer Login Flow
            user = authenticate(username=username, password=password)
        else:
            return Response({'error': 'Please provide username or enrollment number.'}, status=status.HTTP_400_BAD_REQUEST)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            profile_data = None
            if user.role == 'STUDENT':
                try:
                    profile = user.student_profile
                    profile_data = StudentProfileSerializer(profile, context={'request': request}).data
                except StudentProfile.DoesNotExist:
                    pass
            
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                },
                'student_profile': profile_data
            })
        else:
            return Response({'error': 'Invalid credentials. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterStudentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        enrollment_number = request.data.get('enrollment_number')
        full_name = request.data.get('full_name')
        department = request.data.get('department', 'OTHER')

        if not username or not password or not enrollment_number or not full_name:
            return Response({'error': 'Missing required fields (username, password, enrollment number, full name).'}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        if StudentProfile.objects.filter(enrollment_number=enrollment_number).exists():
            return Response({'error': 'Enrollment number already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create CustomUser
        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            role='STUDENT'
        )

        # Create StudentProfile
        profile = StudentProfile.objects.create(
            user=user,
            enrollment_number=enrollment_number,
            full_name=full_name,
            department=department
        )

        # Send welcome notification
        Notification.objects.create(
            user=user,
            title="Welcome to Campus Placement Portal!",
            message=f"Hello {full_name}, your account is successfully registered. Complete your academic & professional profile to check eligibility scores."
        )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            },
            'student_profile': StudentProfileSerializer(profile, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer

    def get_permissions(self):
        if self.action in ['list', 'destroy']:
            # Only Admin/Officers can view all lists and delete students
            return [IsAdminOrOfficer()]
        # Create (handled by custom admin or signup, but DRF POST is Admin/Officer only)
        if self.action == 'create':
            return [IsAdminOrOfficer()]
        # Update, retrieve
        return [permissions.IsAuthenticated(), IsOwnerOrAdminOrOfficer()]

    def list(self, request, *args, **kwargs):
        # Allow searching and filtering students for admin/officers
        queryset = self.get_queryset()
        dept = request.query_params.get('department')
        search = request.query_params.get('search')
        
        if dept:
            queryset = queryset.filter(department=dept)
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) | 
                Q(enrollment_number__icontains=search) |
                Q(skills__icontains=search)
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def me(self, request):
        """
        Endpoint: GET /api/students/me/ -> fetch current logged in student's profile
        Endpoint: PUT/PATCH /api/students/me/ -> update current student's profile
        """
        profile = get_object_or_404(StudentProfile, user=request.user)
        
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
            
        elif request.method in ['PUT', 'PATCH']:
            # Support image and file upload parsing
            partial = request.method == 'PATCH'
            serializer = self.get_serializer(profile, data=request.data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='me/eligibility')
    def eligibility(self, request):
        """
        Endpoint: GET /api/students/me/eligibility/ -> fetch smart eligibility metrics
        """
        profile = get_object_or_404(StudentProfile, user=request.user)
        result = calculate_eligibility_score(profile)
        return Response(result)

    @action(detail=True, methods=['get'], url_path='eligibility_score')
    def eligibility_score(self, request, pk=None):
        """
        Endpoint: GET /api/students/<id>/eligibility_score/ -> fetch eligibility for a specific student (Admin/Officer access)
        """
        if request.user.role not in ['ADMIN', 'OFFICER']:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        profile = self.get_object()
        result = calculate_eligibility_score(profile)
        return Response(result)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by('-created_at')
    serializer_class = CompanySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrOfficer()]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        search = request.query_params.get('search')
        location = request.query_params.get('location')
        min_package = request.query_params.get('min_package')
        eligible_only = request.query_params.get('eligible_only')

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(job_role__icontains=search) | 
                Q(description__icontains=search)
            )
        if location:
            queryset = queryset.filter(location__icontains=location)
        if min_package:
            try:
                queryset = queryset.filter(package_ctc__gte=float(min_package))
            except ValueError:
                pass

        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        
        # If student requests only eligible companies, filter the serialized list
        data = serializer.data
        if eligible_only == 'true' and request.user.role == 'STUDENT':
            data = [c for c in data if c['is_eligible']]

        return Response(data)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-applied_on')
    serializer_class = ApplicationSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'OFFICER']:
            return Application.objects.all().order_by('-applied_on')
        # Otherwise student sees only their own applications
        try:
            return Application.objects.filter(student__user=user).order_by('-applied_on')
        except StudentProfile.DoesNotExist:
            return Application.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        student_id = request.query_params.get('student_id')
        company_id = request.query_params.get('company_id')
        status_filter = request.query_params.get('status')

        if request.user.role in ['ADMIN', 'OFFICER']:
            if student_id:
                queryset = queryset.filter(student_id=student_id)
            if company_id:
                queryset = queryset.filter(company_id=company_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Student applying to a company.
        """
        if request.user.role != 'STUDENT':
            return Response({'error': 'Only students can apply to job listings.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            student = request.user.student_profile
        except StudentProfile.DoesNotExist:
            return Response({'error': 'Please complete your student profile before applying.'}, status=status.HTTP_400_BAD_REQUEST)

        company_id = request.data.get('company')
        if not company_id:
            return Response({'error': 'Company ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        company = get_object_or_404(Company, id=company_id)

        # Check existing applications
        if Application.objects.filter(student=student, company=company).exists():
            return Response({'error': 'You have already applied for this company.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check eligibility criteria strictly
        errors = []
        if student.cgpa < company.min_cgpa:
            errors.append(f"CGPA is {student.cgpa}, minimum required is {company.min_cgpa}")
        if student.active_backlogs > company.max_backlogs:
            errors.append(f"Active backlogs is {student.active_backlogs}, maximum allowed is {company.max_backlogs}")
        if student.tenth_percentage < company.min_tenth_pct:
            errors.append(f"10th marks is {student.tenth_percentage}%, minimum required is {company.min_tenth_pct}%")
        if student.twelfth_percentage < company.min_twelfth_pct:
            errors.append(f"12th marks is {student.twelfth_percentage}%, minimum required is {company.min_twelfth_pct}%")
        if company.allowed_departments and student.department not in company.allowed_departments:
            errors.append(f"Department {student.get_department_display()} is not eligible.")

        if errors:
            return Response({
                'error': 'You do not meet the eligibility criteria for this company.',
                'reasons': errors
            }, status=status.HTTP_400_BAD_REQUEST)

        # Proceed to apply
        application = Application.objects.create(
            student=student,
            company=company,
            status='Applied'
        )

        # Send confirmation notification
        Notification.objects.create(
            user=request.user,
            title=f"Applied successfully for {company.name}",
            message=f"Your application for the position of {company.job_role} at {company.name} has been received. Your current application status is 'Applied'."
        )

        serializer = self.get_serializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Admins and officers updating application status.
        Students can't update application status.
        """
        if request.user.role not in ['ADMIN', 'OFFICER']:
            return Response({'error': 'Only admins or placement officers can update application details.'}, status=status.HTTP_403_FORBIDDEN)

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        old_status = instance.status

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Send notification to student on status update
        new_status = serializer.validated_data.get('status')
        if new_status and old_status != new_status:
            Notification.objects.create(
                user=instance.student.user,
                title=f"Application status updated for {instance.company.name}",
                message=f"The status of your application for {instance.company.name} has changed from '{old_status}' to '{new_status}'."
            )

        return Response(serializer.data)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'All notifications marked as read.'})

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'Notification marked as read.'})

    @action(detail=False, methods=['post'], url_path='send-broadcast')
    def send_broadcast(self, request):
        """
        Admin/Officer broadcasting notification to all students
        """
        if request.user.role not in ['ADMIN', 'OFFICER']:
            return Response({'error': 'Only admins or placement officers can send announcements.'}, status=status.HTTP_403_FORBIDDEN)

        title = request.data.get('title')
        message = request.data.get('message')

        if not title or not message:
            return Response({'error': 'Title and Message are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create notification for all students
        students = CustomUser.objects.filter(role='STUDENT')
        notifications = [
            Notification(user=student, title=title, message=message)
            for student in students
        ]
        Notification.objects.bulk_create(notifications)

        return Response({'status': f'Broadcast sent successfully to {len(notifications)} students.'})

class DashboardStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        General statistics for landing page and dashboards.
        """
        total_students = StudentProfile.objects.count()
        
        # Status counts
        placed_students = StudentProfile.objects.filter(
            applications__status='Selected'
        ).distinct().count()

        total_companies = Company.objects.count()
        total_applications = Application.objects.count()

        # Placement Rate
        placement_rate = (placed_students / total_students * 100) if total_students > 0 else 0

        # Department Placement distribution
        dept_stats = []
        for code, label in StudentProfile.DEPARTMENT_CHOICES:
            dept_students = StudentProfile.objects.filter(department=code)
            dept_total = dept_students.count()
            dept_placed = dept_students.filter(applications__status='Selected').distinct().count()
            
            dept_stats.append({
                'department': label,
                'code': code,
                'total': dept_total,
                'placed': dept_placed,
                'placement_rate': round((dept_placed / dept_total * 100) if dept_total > 0 else 0, 2)
            })

        # Top package
        max_package = Company.objects.aggregate(Max('package_ctc'))['package_ctc__max'] or 0
        avg_package = Company.objects.aggregate(Avg('package_ctc'))['package_ctc__avg'] or 0

        # Application pipeline status breakdown
        app_status_breakdown = Application.objects.values('status').annotate(count=Count('id'))

        return Response({
            'total_students': total_students,
            'placed_students': placed_students,
            'placement_rate': round(placement_rate, 2),
            'total_companies': total_companies,
            'total_applications': total_applications,
            'max_package': round(max_package, 2),
            'avg_package': round(avg_package, 2),
            'department_stats': dept_stats,
            'application_status_breakdown': app_status_breakdown
        })
