from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from api.products.services import ProductService
from api.products.serializers import ProductSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    category_name = request.query_params.get('category', None)
    search_text = request.query_params.get('search', None)
    products = ProductService.list_products(category_name, search_text)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail(request, pk):
    product = ProductService.get_product_detail(pk)
    if not product:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ProductSerializer(product)
    return Response(serializer.data, status=status.HTTP_200_OK)
