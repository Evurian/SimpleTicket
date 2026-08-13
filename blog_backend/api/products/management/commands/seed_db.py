from django.core.management.base import BaseCommand
from api.products.models import Category, Product

class Command(BaseCommand):
    help = 'Seeds the database with initial categories and products'

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")
        
        # Clear existing
        Product.objects.all().delete()
        Category.objects.all().delete()

        # Create Categories
        categories_data = [
            {"name": "electronics", "description": "Laptops, smartphones, audio and accessories"},
            {"name": "jewelery", "description": "Fine rings, bracelets and necklaces"},
            {"name": "men's clothing", "description": "Men jackets, t-shirts, pants"},
            {"name": "women's clothing", "description": "Women dresses, tops, hoodies"},
        ]

        categories = {}
        for cat_data in categories_data:
            cat = Category.objects.create(name=cat_data["name"], description=cat_data["description"])
            categories[cat.name] = cat

        # Create Products
        products_data = [
            # Electronics
            {
                "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                "price": 109.95,
                "category": "men's clothing",
                "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                "stock": 45
            },
            {
                "title": "Mens Casual Premium Slim Fit T-Shirts",
                "price": 22.3,
                "category": "men's clothing",
                "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round collar includes a three-button placket.",
                "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
                "stock": 120
            },
            {
                "title": "Mens Cotton Jacket",
                "price": 55.99,
                "category": "men's clothing",
                "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
                "image": "https://fakestoreapi.com/img/71li-albeXL._AC_UX679_.jpg",
                "stock": 30
            },
            {
                "title": "Mens Casual Slim Fit",
                "price": 15.99,
                "category": "men's clothing",
                "description": "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
                "image": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
                "stock": 85
            },
            {
                "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
                "price": 695.0,
                "category": "jewelery",
                "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
                "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
                "stock": 10
            },
            {
                "title": "Solid Gold Petite Micropave",
                "price": 168.0,
                "category": "jewelery",
                "description": "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and refined in Sentiment, this micro-pave set diamonds ring has a classic style that is stackable.",
                "image": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
                "stock": 15
            },
            {
                "title": "White Gold Plated Princess",
                "price": 9.99,
                "category": "jewelery",
                "description": "Classic Created Wedding Engagement Solitaire Diamond Ring. Gift Box Included. 100% Satisfaction Guaranteed. Great gift for any occasion.",
                "image": "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
                "stock": 60
            },
            {
                "title": "Pierced Owl Rose Gold Plated Stainless Steel Double",
                "price": 10.99,
                "category": "jewelery",
                "description": "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel. Sold as a pair.",
                "image": "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
                "stock": 50
            },
            {
                "title": "WD 2TB Elements Portable External Hard Drive - USB 3.0",
                "price": 64.0,
                "category": "electronics",
                "description": "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
                "image": "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
                "stock": 200
            },
            {
                "title": "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
                "price": 109.0,
                "category": "electronics",
                "description": "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
                "image": "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
                "stock": 150
            },
        ]

        for prod_data in products_data:
            cat = categories[prod_data["category"]]
            Product.objects.create(
                title=prod_data["title"],
                price=prod_data["price"],
                category=cat,
                description=prod_data["description"],
                image=prod_data["image"],
                stock=prod_data["stock"]
            )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with Categories and Products!"))
