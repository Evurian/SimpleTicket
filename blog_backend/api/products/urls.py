from django.urls import path
from api.products.views import product_list, product_detail, category_list

urlpatterns = [
    path('', product_list, name='product-list'),
    path('categories/', category_list, name='category-list'),
    path('<int:pk>/', product_detail, name='product-detail'),
]
