from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from api.products.models import Product, Category
from api.orders.models import Order, OrderItem
from api.orders.services import OrderService

class OrderTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password123", email="test@test.com")
        self.category = Category.objects.create(name="electronics")
        self.product = Product.objects.create(
            title="Test Laptop",
            price=999.99,
            category=self.category,
            description="High-end laptop",
            stock=5
        )

    def test_place_order_success(self):
        items_data = [{"product_id": self.product.id, "quantity": 2}]
        order = OrderService.place_order(
            user=self.user,
            items_data=items_data,
            shipping_address="123 Test St"
        )
        self.assertIsNotNone(order)
        self.assertEqual(order.total_price, Decimal('1999.98'))
        self.assertEqual(order.status, 'PENDING')
        
        # Check stock reduction
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)

        # Check OrderItem creation
        order_items = OrderItem.objects.filter(order=order)
        self.assertEqual(order_items.count(), 1)
        self.assertEqual(order_items[0].product, self.product)

    def test_place_order_out_of_stock(self):
        items_data = [{"product_id": self.product.id, "quantity": 10}]
        with self.assertRaises(ValueError):
            OrderService.place_order(
                user=self.user,
                items_data=items_data,
                shipping_address="123 Test St"
            )
