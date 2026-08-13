from api.products.repositories import ProductRepository, CategoryRepository

class ProductService:
    @staticmethod
    def list_products(category_name=None, search_text=None):
        return ProductRepository.get_all(category_name, search_text)

    @staticmethod
    def get_product_detail(product_id):
        return ProductRepository.get_by_id(product_id)

    @staticmethod
    def reduce_stock(product_id, quantity):
        product = ProductRepository.get_by_id(product_id)
        if not product:
            raise ValueError("Product not found")
        if product.stock < quantity:
            raise ValueError(f"Insufficient stock for product {product.title}. Available: {product.stock}")
        return ProductRepository.update_stock(product, -quantity)

    @staticmethod
    def add_stock(product_id, quantity):
        product = ProductRepository.get_by_id(product_id)
        if not product:
            raise ValueError("Product not found")
        return ProductRepository.update_stock(product, quantity)
