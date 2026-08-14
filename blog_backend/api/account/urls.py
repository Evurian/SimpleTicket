from django.urls import path
from api.account.views import signUp, signIn, profile, profileUpdate, admin_users_list, admin_user_detail

urlpatterns = [
    path('signUp/', signUp, name = 'signUp'),
    path('signIn/', signIn, name = 'signIn'),
    path('profile/', profile, name = 'profile'),
    path('profile/update/', profileUpdate, name = 'profileUpdate'),
    path('admin/users/', admin_users_list, name='admin-users-list'),
    path('admin/users/<int:pk>/', admin_user_detail, name='admin-user-detail'),
]