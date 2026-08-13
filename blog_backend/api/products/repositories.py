from django.db.models import Q
from api.products.models import Product, Category

class ProductRepository:
    @staticmethod
    def get_all(category_name=None, search_text=None):
        queryset = Product.objects.all()
        if category_name:
            queryset = queryset.filter(category__name__iexact=category_name)
        if search_text:
            queryset = queryset.filter(
                Q(title__icontains=search_text) | 
                Q(description__icontains=search_text)
            )
        return queryset

    @staticmethod
    def get_by_id(product_id):
        try:
            return Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return None

    @staticmethod
    def update_stock(product, quantity):
        product.stock += quantity
        product.save()
        return product

class CategoryRepository:
    @staticmethod
    def get_all():
        return Category.objects.all()

    @staticmethod
    def get_or_create(name):
        category, created = Category.objects.get_or_create(name=name)
        return category
