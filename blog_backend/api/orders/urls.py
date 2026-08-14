from django.urls import path
from api.orders.views import order_list_create, admin_dashboard_stats, admin_orders_list, admin_order_detail

urlpatterns = [
    path('', order_list_create, name='order-list-create'),
    path('admin/dashboard/', admin_dashboard_stats, name='admin-dashboard-stats'),
    path('admin/orders/', admin_orders_list, name='admin-orders-list'),
    path('admin/orders/<int:pk>/', admin_order_detail, name='admin-order-detail'),
]
