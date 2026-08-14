from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from api.orders.services import OrderService
from api.orders.serializers import OrderSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def order_list_create(request):
    if request.method == 'GET':
        orders = OrderService.get_user_orders(request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    elif request.method == 'POST':
        items_data = request.data.get('items', [])
        shipping_address = request.data.get('shipping_address', '')
        
        if not items_data:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        if not shipping_address:
            return Response({'error': 'Shipping address is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            order = OrderService.place_order(
                user=request.user,
                items_data=items_data,
                shipping_address=shipping_address
            )
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin Dashboard & Order Management
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from api.products.models import Product
from api.orders.models import Order

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    if not request.user or not request.user.is_staff:
        return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        
    # Total revenue
    revenue_dict = Order.objects.aggregate(total_revenue=Sum('total_price'))
    total_revenue = revenue_dict['total_revenue'] or 0
    
    # Total orders
    total_orders = Order.objects.count()
    
    # Total products
    total_products = Product.objects.count()
    
    # Stock levels
    low_stock = Product.objects.filter(stock__lte=5, stock__gt=0).count()
    out_of_stock = Product.objects.filter(stock=0).count()
    
    # Orders by status
    status_counts = Order.objects.values('status').annotate(count=Count('id'))
    status_data = {
        'PENDING': 0,
        'SHIPPED': 0,
        'DELIVERED': 0
    }
    for item in status_counts:
        status_data[item['status']] = item['count']
        
    # Sales by day (last 7 days)
    sales_by_day = []
    today = timezone.localdate()
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_start = timezone.make_aware(timezone.datetime.combine(day, timezone.datetime.min.time()))
        day_end = timezone.make_aware(timezone.datetime.combine(day, timezone.datetime.max.time()))
        
        day_sales = Order.objects.filter(created_at__range=(day_start, day_end)).aggregate(revenue=Sum('total_price'))['revenue'] or 0
        sales_by_day.append({
            'date': day.strftime('%Y-%m-%d'),
            'revenue': float(day_sales)
        })
        
    return Response({
        'total_revenue': float(total_revenue),
        'total_orders': total_orders,
        'total_products': total_products,
        'low_stock': low_stock,
        'out_of_stock': out_of_stock,
        'status_counts': status_data,
        'sales_by_day': sales_by_day
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_orders_list(request):
    if not request.user or not request.user.is_staff:
        return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_order_detail(request, pk):
    if not request.user or not request.user.is_staff:
        return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        status_val = request.data.get('status')
        if status_val not in ['PENDING', 'SHIPPED', 'DELIVERED']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
            
        order.status = status_val
        order.save()
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
