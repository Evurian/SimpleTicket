from django.urls import path
from api.orders.views import order_list_create

urlpatterns = [
    path('', order_list_create, name='order-list-create'),
]
