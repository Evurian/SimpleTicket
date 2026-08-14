from rest_framework import serializers
from api.products.models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name')

    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'category', 'description', 'image', 'stock']

    def create(self, validated_data):
        category_data = validated_data.pop('category', None)
        category_name = category_data.get('name') if category_data else 'General'
        category, created = Category.objects.get_or_create(name=category_name)
        product = Product.objects.create(category=category, **validated_data)
        return product

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category', None)
        if category_data:
            category_name = category_data.get('name')
            category, created = Category.objects.get_or_create(name=category_name)
            instance.category = category
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
