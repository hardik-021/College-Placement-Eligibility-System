from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, StudentProfile, Company, Application, Notification

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Role Details', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Details', {'fields': ('role',)}),
    )

class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('enrollment_number', 'full_name', 'department', 'semester', 'cgpa', 'active_backlogs')
    list_filter = ('department', 'semester', 'active_backlogs')
    search_fields = ('enrollment_number', 'full_name', 'user__username', 'user__email')
    ordering = ('enrollment_number',)

class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'job_role', 'package_ctc', 'location', 'min_cgpa', 'deadline')
    list_filter = ('location', 'min_cgpa')
    search_fields = ('name', 'job_role', 'location')
    ordering = ('-created_at',)

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'company', 'status', 'applied_on')
    list_filter = ('status', 'applied_on', 'company__name')
    search_fields = ('student__full_name', 'student__enrollment_number', 'company__name', 'company__job_role')
    ordering = ('-applied_on',)

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__username', 'title', 'message')
    ordering = ('-created_at',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(StudentProfile, StudentProfileAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Application, ApplicationAdmin)
admin.site.register(Notification, NotificationAdmin)
