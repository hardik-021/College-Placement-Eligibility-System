import os
import django
import datetime
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import CustomUser, StudentProfile, Company, Application, Notification

def seed():
    print("Seeding database...")
    
    # 1. Create Admins and Placement Officers
    if not CustomUser.objects.filter(username='admin').exists():
        admin = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@college.edu',
            password='admin123',
            role='ADMIN'
        )
        print("Created admin user (pw: admin123)")
    else:
        admin = CustomUser.objects.get(username='admin')
        
    if not CustomUser.objects.filter(username='officer').exists():
        officer = CustomUser.objects.create_user(
            username='officer',
            email='officer@college.edu',
            password='officer123',
            role='OFFICER'
        )
        print("Created placement officer user (pw: officer123)")
    else:
        officer = CustomUser.objects.get(username='officer')

    # 2. Create Students
    students_data = [
        {
            'username': 'student1',
            'email': 'student1@college.edu',
            'password': 'student123',
            'enrollment_number': '2026CE001',
            'full_name': 'Darshan Patel',
            'phone': '9876543210',
            'department': 'CE',
            'semester': 7,
            'cgpa': 8.75,
            'active_backlogs': 0,
            'tenth_percentage': 89.40,
            'twelfth_percentage': 91.20,
            'skills': 'React, Node.js, Python, Django, SQL',
            'certifications': 'AWS Cloud Practitioner, React Developer Certificate'
        },
        {
            'username': 'student2',
            'email': 'student2@college.edu',
            'password': 'student123',
            'enrollment_number': '2026IT002',
            'full_name': 'Aarav Mehta',
            'phone': '9876543211',
            'department': 'IT',
            'semester': 7,
            'cgpa': 6.20,
            'active_backlogs': 1,
            'tenth_percentage': 72.50,
            'twelfth_percentage': 70.00,
            'skills': 'HTML, CSS, JavaScript, Git',
            'certifications': ''
        },
        {
            'username': 'student3',
            'email': 'student3@college.edu',
            'password': 'student123',
            'enrollment_number': '2026CSE003',
            'full_name': 'Pooja Sharma',
            'phone': '9876543212',
            'department': 'CSE',
            'semester': 7,
            'cgpa': 9.20,
            'active_backlogs': 0,
            'tenth_percentage': 95.00,
            'twelfth_percentage': 92.50,
            'skills': 'Python, Django, C++, Java, Machine Learning, SQL',
            'certifications': 'Google IT Support Certificate, DeepLearning.AI Specialization'
        },
        {
            'username': 'student4',
            'email': 'student4@college.edu',
            'password': 'student123',
            'enrollment_number': '2026EC004',
            'full_name': 'Rohan Shah',
            'phone': '9876543213',
            'department': 'EC',
            'semester': 7,
            'cgpa': 7.10,
            'active_backlogs': 0,
            'tenth_percentage': 80.00,
            'twelfth_percentage': 78.50,
            'skills': 'Arduino, Embedded Systems, C, MATLAB',
            'certifications': 'Embedded IoT Specialist'
        }
    ]

    for data in students_data:
        if not CustomUser.objects.filter(username=data['username']).exists():
            user = CustomUser.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                role='STUDENT'
            )
            StudentProfile.objects.create(
                user=user,
                enrollment_number=data['enrollment_number'],
                full_name=data['full_name'],
                phone=data['phone'],
                department=data['department'],
                semester=data['semester'],
                cgpa=data['cgpa'],
                active_backlogs=data['active_backlogs'],
                tenth_percentage=data['tenth_percentage'],
                twelfth_percentage=data['twelfth_percentage'],
                skills=data['skills'],
                certifications=data['certifications']
            )
            
            # Create a welcome notification
            Notification.objects.create(
                user=user,
                title="Account Setup Complete",
                message=f"Welcome {data['full_name']}! Your placement eligibility profile has been seeded."
            )
            print(f"Created student user {data['username']} (pw: student123)")
        else:
            print(f"Student user {data['username']} already exists")

    # 3. Create Companies
    companies_data = [
        {
            'name': 'Google',
            'description': 'Google LLC is an American multinational technology company focusing on artificial intelligence, search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, consumer electronics, and instructional technology.',
            'job_role': 'Software Engineer (L3)',
            'package_ctc': 35.50, # LPA
            'location': 'Bangalore, India',
            'min_cgpa': 8.50,
            'max_backlogs': 0,
            'min_tenth_pct': 85.00,
            'min_twelfth_pct': 85.00,
            'allowed_departments': ['CE', 'IT', 'CSE', 'AI_DS'],
            'deadline_days': 15
        },
        {
            'name': 'Microsoft',
            'description': 'Microsoft Corporation is an American multinational technology corporation headquartered in Redmond, Washington. Microsofts best-known software products are the Windows line of operating systems, the Microsoft 365 suite of productivity applications, and the Edge web browser.',
            'job_role': 'Support Engineer',
            'package_ctc': 18.00, # LPA
            'location': 'Hyderabad, India',
            'min_cgpa': 7.50,
            'max_backlogs': 0,
            'min_tenth_pct': 75.00,
            'min_twelfth_pct': 75.00,
            'allowed_departments': ['CE', 'IT', 'CSE', 'EC'],
            'deadline_days': 10
        },
        {
            'name': 'Infosys',
            'description': 'Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services. The company was founded in Pune and is headquartered in Bangalore.',
            'job_role': 'Systems Engineer',
            'package_ctc': 4.25, # LPA
            'location': 'Pune, India',
            'min_cgpa': 6.00,
            'max_backlogs': 2,
            'min_tenth_pct': 60.00,
            'min_twelfth_pct': 60.00,
            'allowed_departments': [], # Empty means all departments
            'deadline_days': 20
        },
        {
            'name': 'Accenture',
            'description': 'Accenture plc is an Irish-American professional services company based in Dublin, specializing in information technology services and consulting. A Fortune Global 500 company, it reported revenues of $64.11 billion in 2023.',
            'job_role': 'Associate Software Engineer',
            'package_ctc': 6.50, # LPA
            'location': 'Mumbai, India',
            'min_cgpa': 6.50,
            'max_backlogs': 1,
            'min_tenth_pct': 65.00,
            'min_twelfth_pct': 65.00,
            'allowed_departments': ['CE', 'IT', 'CSE', 'AI_DS', 'EC', 'EE'],
            'deadline_days': 30
        },
        {
            'name': 'Tata Consultancy Services (TCS)',
            'description': 'Tata Consultancy Services Limited (TCS) is an Indian multinational information technology services and consulting company headquartered in Mumbai. It is a part of the Tata Group and operates in 150 locations across 46 countries.',
            'job_role': 'TCS Ninja & Digital Developer',
            'package_ctc': 7.00, # LPA
            'location': 'Chennai, India',
            'min_cgpa': 7.00,
            'max_backlogs': 0,
            'min_tenth_pct': 70.00,
            'min_twelfth_pct': 70.00,
            'allowed_departments': [], # Open
            'deadline_days': 5
        }
    ]

    for c_data in companies_data:
        if not Company.objects.filter(name=c_data['name']).exists():
            deadline = timezone.now() + datetime.timedelta(days=c_data['deadline_days'])
            Company.objects.create(
                name=c_data['name'],
                description=c_data['description'],
                job_role=c_data['job_role'],
                package_ctc=c_data['package_ctc'],
                location=c_data['location'],
                min_cgpa=c_data['min_cgpa'],
                max_backlogs=c_data['max_backlogs'],
                min_tenth_pct=c_data['min_tenth_pct'],
                min_twelfth_pct=c_data['min_twelfth_pct'],
                allowed_departments=c_data['allowed_departments'],
                deadline=deadline
            )
            print(f"Created company {c_data['name']}")
        else:
            print(f"Company {c_data['name']} already exists")

    # 4. Create some seed applications
    darshan_profile = StudentProfile.objects.get(enrollment_number='2026CE001')
    pooja_profile = StudentProfile.objects.get(enrollment_number='2026CSE003')
    
    tcs = Company.objects.get(name='Tata Consultancy Services (TCS)')
    accenture = Company.objects.get(name='Accenture')
    google = Company.objects.get(name='Google')

    # Seed application 1: Darshan -> TCS (Selected)
    if not Application.objects.filter(student=darshan_profile, company=tcs).exists():
        app = Application.objects.create(
            student=darshan_profile,
            company=tcs,
            status='Selected',
            feedback='Excellent performance in technical round and coding test.'
        )
        # Notify user
        Notification.objects.create(
            user=darshan_profile.user,
            title="Congratulations! You are Selected in TCS",
            message="We are pleased to inform you that you have been selected for the TCS Ninja & Digital Developer position!"
        )
        print("Created application: Darshan -> TCS (Selected)")

    # Seed application 2: Darshan -> Accenture (Interview Scheduled)
    if not Application.objects.filter(student=darshan_profile, company=accenture).exists():
        app = Application.objects.create(
            student=darshan_profile,
            company=accenture,
            status='Interview Scheduled',
            feedback='Technical Interview is scheduled for July 25th, 2026 at 10:00 AM.'
        )
        Notification.objects.create(
            user=darshan_profile.user,
            title="Accenture Interview Scheduled",
            message="Your technical interview with Accenture is scheduled for July 25th, 2026. Please check your email for the meeting link."
        )
        print("Created application: Darshan -> Accenture (Interview Scheduled)")

    # Seed application 3: Pooja -> Google (Shortlisted)
    if not Application.objects.filter(student=pooja_profile, company=google).exists():
        app = Application.objects.create(
            student=pooja_profile,
            company=google,
            status='Shortlisted',
            feedback='Shortlisted based on resume. Next step: Online Coding Challenge.'
        )
        Notification.objects.create(
            user=pooja_profile.user,
            title="Shortlisted for Google Software Engineer",
            message="Great news! You have been shortlisted for the next round of Google recruitment. Watch out for a coderpad link in your email."
        )
        print("Created application: Pooja -> Google (Shortlisted)")

    print("Database seeding completed successfully.")

if __name__ == '__main__':
    seed()
