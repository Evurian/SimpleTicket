from django.test import TestCase
from api.products.models import Product, Category
from api.products.repositories import ProductRepository
from api.products.services import ProductService

class ProductTestCase(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="electronics", description="Electronic items")
        self.product = Product.objects.create(
            title="Test Phone",
            price=299.99,
            category=self.category,
            description="A great test phone",
            stock=10
        )

    def test_product_repository_get_all(self):
        products = ProductRepository.get_all()
        self.assertEqual(products.count(), 1)
        self.assertEqual(products[0].title, "Test Phone")

    def test_product_repository_get_by_id(self):
        product = ProductRepository.get_by_id(self.product.id)
        self.assertIsNotNone(product)
        self.assertEqual(product.title, "Test Phone")

    def test_product_service_reduce_stock(self):
        ProductService.reduce_stock(self.product.id, 3)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 7)

    def test_product_service_insufficient_stock(self):
        with self.assertRaises(ValueError):
            ProductService.reduce_stock(self.product.id, 15)
