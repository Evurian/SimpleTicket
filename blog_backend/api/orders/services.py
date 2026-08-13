from django.db import transaction
from api.orders.repositories import OrderRepository
from api.products.services import ProductService

class OrderService:
    @staticmethod
    def get_user_orders(user):
        return OrderRepository.get_orders_by_user(user)

    @staticmethod
    @transaction.atomic
    def place_order(user, items_data, shipping_address):
        """
        items_data format:
        [
            {"product_id": 1, "quantity": 2},
            {"product_id": 2, "quantity": 1}
        ]
        """
        # First, validate products and stock
        total_price = 0
        validated_items = []
        
        for item in items_data:
            product_id = item.get('product_id')
            quantity = item.get('quantity')
            
            if not product_id or not quantity or quantity <= 0:
                raise ValueError("Invalid item format or quantity")
            
            product = ProductService.get_product_detail(product_id)
            if not product:
                raise ValueError(f"Product with ID {product_id} does not exist")
            
            if product.stock < quantity:
                raise ValueError(f"Insufficient stock for {product.title}. Required: {quantity}, Available: {product.stock}")
            
            total_price += product.price * quantity
            validated_items.append((product, quantity))

        # Create the order
        order = OrderRepository.create_order(
            user=user,
            total_price=total_price,
            shipping_address=shipping_address
        )

        # Create order items and reduce stock
        for product, quantity in validated_items:
            # Reduce stock
            ProductService.reduce_stock(product.id, quantity)
            # Create OrderItem record
            OrderRepository.create_order_item(
                order=order,
                product=product,
                price=product.price,
                quantity=quantity
            )

        return order
