from django.urls import path
from api.account.views import signUp, signIn, profile, profileUpdate

urlpatterns = [
    path('signUp/', signUp, name = 'signUp'),
    path('signIn/', signIn, name = 'signIn'),
    path('profile/', profile, name = 'profile'),
    path('profile/update/', profileUpdate, name = 'profileUpdate'),
]