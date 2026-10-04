from rest_framework import serializers
from .models import CustomUser, StudentProfile, Company, Application, Notification

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'password')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'STUDENT'),
            password=validated_data['password']
        )
        return user

class StudentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    photo_url = serializers.SerializerMethodField()
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = (
            'id', 'username', 'email', 'enrollment_number', 'full_name', 'phone', 
            'photo', 'photo_url', 'department', 'semester', 'cgpa', 'active_backlogs', 
            'tenth_percentage', 'twelfth_percentage', 'skills', 'certifications', 
            'resume', 'resume_url', 'linkedin_url', 'github_url'
        )
        extra_kwargs = {
            'enrollment_number': {'read_only': True}  # Enrollment number is read-only
        }

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None

    def get_resume_url(self, obj):
        if obj.resume:
            return obj.resume.url
        return None

class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    is_eligible = serializers.SerializerMethodField()
    eligibility_details = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = (
            'id', 'name', 'logo', 'logo_url', 'description', 'job_role', 'package_ctc', 
            'location', 'min_cgpa', 'max_backlogs', 'min_tenth_pct', 'min_twelfth_pct', 
            'allowed_departments', 'deadline', 'created_at', 'is_eligible', 'eligibility_details'
        )

    def get_logo_url(self, obj):
        if obj.logo:
            return obj.logo.url
        return None

    def get_is_eligible(self, obj):
        request = self.context.get('request')
        if not request or not request.user or request.user.role != 'STUDENT':
            return True
        try:
            profile = request.user.student_profile
            return (
                profile.cgpa >= obj.min_cgpa and
                profile.active_backlogs <= obj.max_backlogs and
                profile.tenth_percentage >= obj.min_tenth_pct and
                profile.twelfth_percentage >= obj.min_twelfth_pct and
                (not obj.allowed_departments or profile.department in obj.allowed_departments)
            )
        except StudentProfile.DoesNotExist:
            return False

    def get_eligibility_details(self, obj):
        request = self.context.get('request')
        if not request or not request.user or request.user.role != 'STUDENT':
            return None
        try:
            profile = request.user.student_profile
            reasons = []
            if profile.cgpa < obj.min_cgpa:
                reasons.append(f"CGPA is {profile.cgpa}, minimum required is {obj.min_cgpa}")
            if profile.active_backlogs > obj.max_backlogs:
                reasons.append(f"Active backlogs is {profile.active_backlogs}, maximum allowed is {obj.max_backlogs}")
            if profile.tenth_percentage < obj.min_tenth_pct:
                reasons.append(f"10th marks is {profile.tenth_percentage}%, minimum required is {obj.min_tenth_pct}%")
            if profile.twelfth_percentage < obj.min_twelfth_pct:
                reasons.append(f"12th marks is {profile.twelfth_percentage}%, minimum required is {obj.min_twelfth_pct}%")
            if obj.allowed_departments and profile.department not in obj.allowed_departments:
                reasons.append(f"Department {profile.get_department_display()} is not eligible for this role.")
            
            return {
                'eligible': len(reasons) == 0,
                'reasons': reasons
            }
        except StudentProfile.DoesNotExist:
            return {'eligible': False, 'reasons': ['Student profile does not exist.']}

class ApplicationSerializer(serializers.ModelSerializer):
    student_details = StudentProfileSerializer(source='student', read_only=True)
    company_details = CompanySerializer(source='company', read_only=True)

    class Meta:
        model = Application
        fields = ('id', 'student', 'company', 'student_details', 'company_details', 'status', 'applied_on', 'feedback')
        read_only_fields = ('student', 'applied_on')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'title', 'message', 'is_read', 'created_at')
