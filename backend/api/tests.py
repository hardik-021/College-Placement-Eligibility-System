from django.test import TestCase
from decimal import Decimal
from django.contrib.auth import get_user_model
from .models import StudentProfile, Company, Application
from .utils import calculate_eligibility_score

User = get_user_model()

class EligibilityTestCase(TestCase):
    def setUp(self):
        # Create a test student user
        self.user = User.objects.create_user(
            username='teststudent',
            email='teststudent@college.edu',
            password='studentpassword',
            role='STUDENT'
        )
        self.profile = StudentProfile.objects.create(
            user=self.user,
            enrollment_number='TEST202601',
            full_name='Test Student',
            department='CE',
            semester=7,
            cgpa=Decimal('8.50'),
            active_backlogs=0,
            tenth_percentage=Decimal('85.00'),
            twelfth_percentage=Decimal('85.00'),
            skills='React, Django, Python, SQL',
            certifications='AWS Cloud Practitioner'
        )

        # Create a test company
        self.company = Company.objects.create(
            name='Test Tech Inc',
            description='A great tech company.',
            job_role='QA Engineer',
            package_ctc=Decimal('10.00'),
            location='Online',
            min_cgpa=Decimal('7.50'),
            max_backlogs=0,
            min_tenth_pct=Decimal('75.00'),
            min_twelfth_pct=Decimal('75.00'),
            allowed_departments=['CE', 'IT', 'CSE'],
            deadline='2026-12-31T23:59:59Z'
        )

    def test_smart_eligibility_score_calculation(self):
        # Student profile:
        # CGPA = 8.5 -> score = (8.5/10) * 40 = 34
        # Skills = 4 skills -> score = 20
        # Backlogs = 0 -> score = 20
        # Resume = missing -> score = 0
        # Certifications = present -> score = 10
        # Expected Total Score = 34 + 20 + 20 + 0 + 10 = 84
        result = calculate_eligibility_score(self.profile)
        self.assertEqual(result['score'], 84.00)
        self.assertTrue(result['is_eligible'])

    def test_smart_eligibility_score_with_backlogs(self):
        # Set backlogs to 1, which should remove backlog score and flag student as ineligible
        self.profile.active_backlogs = 1
        self.profile.save()

        result = calculate_eligibility_score(self.profile)
        # Expected Total Score = 34 (CGPA) + 20 (Skills) + 0 (Backlogs) + 0 (Resume) + 10 (Certs) = 64
        self.assertEqual(result['score'], 64.00)
        self.assertFalse(result['is_eligible'])
        self.assertIn("You currently have 1 active backlog(s). Many companies require zero backlogs.", result['reasons'])

    def test_company_eligibility_criteria_match(self):
        # The student profile meets all company criteria (CGPA 8.5 >= 7.5, Backlogs 0 <= 0, department CE in allowed_departments)
        # Check standard checks by asserting serializer-like checks
        is_eligible = (
            self.profile.cgpa >= self.company.min_cgpa and
            self.profile.active_backlogs <= self.company.max_backlogs and
            self.profile.tenth_percentage >= self.company.min_tenth_pct and
            self.profile.twelfth_percentage >= self.company.min_twelfth_pct and
            (not self.company.allowed_departments or self.profile.department in self.company.allowed_departments)
        )
        self.assertTrue(is_eligible)

    def test_company_eligibility_department_restriction(self):
        # Change student department to ME (Mechanical Engineering) which is not in company allowed_departments
        self.profile.department = 'ME'
        self.profile.save()

        is_eligible = (
            self.profile.cgpa >= self.company.min_cgpa and
            self.profile.active_backlogs <= self.company.max_backlogs and
            self.profile.tenth_percentage >= self.company.min_tenth_pct and
            self.profile.twelfth_percentage >= self.company.min_twelfth_pct and
            (not self.company.allowed_departments or self.profile.department in self.company.allowed_departments)
        )
        self.assertFalse(is_eligible)
