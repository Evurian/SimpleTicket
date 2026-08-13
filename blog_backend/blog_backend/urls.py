from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/account/', include('api.account.urls')),
    path('api/products/', include('api.products.urls')),
    path('api/orders/', include('api.orders.urls')),
]