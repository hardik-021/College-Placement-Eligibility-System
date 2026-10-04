from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('OFFICER', 'Placement Officer'),
        ('STUDENT', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')

    def __str__(self):
        return f"{self.username} ({self.role})"

class StudentProfile(models.Model):
    DEPARTMENT_CHOICES = (
        ('CE', 'Computer Engineering (CE)'),
        ('IT', 'Information Technology (IT)'),
        ('CSE', 'Computer Science & Engineering (CSE)'),
        ('AI_DS', 'Artificial Intelligence & Data Science (AI & DS)'),
        ('EC', 'Electronics & Communication Engineering (EC)'),
        ('EE', 'Electrical Engineering (EE)'),
        ('ME', 'Mechanical Engineering (ME)'),
        ('CIVIL', 'Civil Engineering'),
        ('OTHER', 'Other'),
    )

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    enrollment_number = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    
    # Academic Details
    department = models.CharField(max_length=10, choices=DEPARTMENT_CHOICES, default='OTHER')
    semester = models.IntegerField(default=1)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    active_backlogs = models.IntegerField(default=0)
    tenth_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    twelfth_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Professional Details
    skills = models.TextField(blank=True, default='')  # Comma-separated list of skills
    certifications = models.TextField(blank=True, default='')  # Text description/comma-separated
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.full_name} ({self.enrollment_number})"

class Company(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    description = models.TextField()
    job_role = models.CharField(max_length=100)
    package_ctc = models.DecimalField(max_digits=6, decimal_places=2)  # LPA (e.g. 12.50 for 12.5 LPA)
    location = models.CharField(max_length=100)
    
    # Eligibility Criteria
    min_cgpa = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    max_backlogs = models.IntegerField(default=0)
    min_tenth_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    min_twelfth_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    allowed_departments = models.JSONField(default=list)  # List of allowed departments e.g., ["CE", "IT", "CSE"]
    
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.job_role}"

class Application(models.Model):
    STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Under Review', 'Under Review'),
        ('Shortlisted', 'Shortlisted'),
        ('Interview Scheduled', 'Interview Scheduled'),
        ('Selected', 'Selected'),
        ('Rejected', 'Rejected'),
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='Applied')
    applied_on = models.DateTimeField(auto_now_add=True)
    feedback = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('student', 'company')

    def __str__(self):
        return f"{self.student.full_name} -> {self.company.name} ({self.status})"

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=150)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"
