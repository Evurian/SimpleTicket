from api.orders.models import Order, OrderItem
from api.products.models import Product

class OrderRepository:
    @staticmethod
    def create_order(user, total_price, shipping_address):
        return Order.objects.create(
            user=user,
            total_price=total_price,
            shipping_address=shipping_address,
            status='PENDING'
        )

    @staticmethod
    def create_order_item(order, product, price, quantity):
        return OrderItem.objects.create(
            order=order,
            product=product,
            price=price,
            quantity=quantity
        )

    @staticmethod
    def get_orders_by_user(user):
        return Order.objects.filter(user=user).order_by('-created_at')

    @staticmethod
    def get_order_by_id(order_id, user):
        try:
            return Order.objects.get(pk=order_id, user=user)
        except Order.DoesNotExist:
            return None
