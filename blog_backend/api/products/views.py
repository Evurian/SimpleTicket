from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from api.products.services import ProductService
from api.products.serializers import ProductSerializer

from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from api.products.models import Category, Product
from api.products.serializers import CategorySerializer

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def product_list(request):
    if request.method == 'GET':
        category_name = request.query_params.get('category', None)
        search_text = request.query_params.get('search', None)
        products = ProductService.list_products(category_name, search_text)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        # Check admin permission
        if not request.user or not request.user.is_authenticated or not request.user.is_staff:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
            
        data = request.data.copy()
        
        # Check if an image file is uploaded
        if 'image_file' in request.FILES:
            image_file = request.FILES['image_file']
            file_name = default_storage.save(f"products/{image_file.name}", image_file)
            file_url = request.build_absolute_uri(settings.MEDIA_URL + file_name)
            data['image'] = file_url
            
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def product_detail(request, pk):
    product = ProductService.get_product_detail(pk)
    if not product:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    elif request.method == 'PUT':
        # Check admin permission
        if not request.user or not request.user.is_authenticated or not request.user.is_staff:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
            
        data = request.data.copy()
        
        # Check if an image file is uploaded
        if 'image_file' in request.FILES:
            image_file = request.FILES['image_file']
            file_name = default_storage.save(f"products/{image_file.name}", image_file)
            file_url = request.build_absolute_uri(settings.MEDIA_URL + file_name)
            data['image'] = file_url
            
        serializer = ProductSerializer(product, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE':
        # Check admin permission
        if not request.user or not request.user.is_authenticated or not request.user.is_staff:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
            
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all().order_by('name')
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        # Check admin permission
        if not request.user or not request.user.is_authenticated or not request.user.is_staff:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
