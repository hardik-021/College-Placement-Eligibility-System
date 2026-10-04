from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, RegisterStudentView, StudentViewSet, 
    CompanyViewSet, ApplicationViewSet, NotificationViewSet, 
    DashboardStatsView
)

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='api-login'),
    path('auth/register/', RegisterStudentView.as_view(), name='api-register'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='api-stats'),
]
