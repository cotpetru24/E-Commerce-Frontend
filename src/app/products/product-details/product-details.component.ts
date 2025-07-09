import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductDto } from '../../models/product.dto';
import { CartService } from '../../services/cart.service';
import { TargetAudience } from '../../models/gender.enum';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDto | null = null;
  selectedImage: string = '';
  productImages: string[] = [];
  rating: number = 4.5;
  reviewCount: number = 128;
  selectedSize: string = '';
  quantity: number = 1;
  maxQuantity: number = 10;
  isInWishlist: boolean = false;
  productFeatures: string[] = [];
  availableSizes: string[] = ['7', '8', '9', '10', '11', '12'];
  relatedProducts: ProductDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(productId: string) {
    // Simulate loading product data
    // In a real app, this would be an API call
    const allProducts: ProductDto[] = [
      {
        id: 1,
        name: "Men's Retro Sneaker",
        description:
          "This comfortable men's sneaker features a retro design with a modern touch. Perfect for casual wear, these shoes combine style and comfort with a durable construction that will last through daily use. The breathable upper material keeps your feet cool while the cushioned sole provides excellent support for all-day comfort.",
        price: 64.99,
        image: 'products/retro-sneaker.png',
        stock: 10,
        targetAudience: TargetAudience.Men,
        brand: 'Nike',
      },
      {
        id: 2,
        name: "Men's Running Shoe",
        description:
          'Lightweight and cushioned. The perfect running shoe for your daily tune.',
        price: 89.39,
        image: 'products/running-shoe.png',
        stock: 7,
        targetAudience: TargetAudience.Men,
        brand: 'Adidas',
      },
      {
        id: 3,
        name: "Men's Casual Sneaker",
        description:
          "A versatile men's casual sneaker with a minimal and stylish design.",
        price: 74.39,
        image: 'products/casual-sneaker.png',
        stock: 5,
        targetAudience: TargetAudience.Men,
        brand: 'Puma',
      },
      {
        id: 4,
        name: "Women's Elegant Heel",
        description:
          'Elegant and comfortable heel perfect for formal occasions.',
        price: 99.99,
        image: 'products/retro-sneaker2.png',
        stock: 8,
        targetAudience: TargetAudience.Women,
        brand: 'Steve Madden',
      },
      {
        id: 5,
        name: "Children's Play Shoe",
        description:
          'Durable and comfortable shoes perfect for active children.',
        price: 45.99,
        image: 'products/casual-sneaker.png',
        stock: 12,
        targetAudience: TargetAudience.Children,
        brand: 'Skechers',
      },
      {
        id: 6,
        name: "Women's Athletic Shoe",
        description:
          'High-performance athletic shoes for women who love to stay active.',
        price: 79.99,
        image: 'products/running-shoe.png',
        stock: 6,
        targetAudience: TargetAudience.Women,
        brand: 'Under Armour',
      },
    ];

    this.product =
      allProducts.find((p) => p.id === parseInt(productId)) || null;

    if (this.product) {
      this.initializeProductData();
      this.loadRelatedProducts();
    }
  }

  initializeProductData() {
    if (!this.product) return;

    // Set up product images
    this.productImages = [
      this.product.image,
      'products/retro-sneaker2.png',
      'products/running-shoe.png',
      'products/casual-sneaker.png',
    ];
    this.selectedImage = this.productImages[0];

    // Set up product features
    this.productFeatures = [
      'Breathable mesh upper',
      'Cushioned midsole for comfort',
      'Durable rubber outsole',
      'Lightweight construction',
      'Available in multiple colors',
    ];

    // Set max quantity based on stock
    this.maxQuantity = Math.min(this.product.stock, 10);
  }

  loadRelatedProducts() {
    if (!this.product) return;

    // Simulate loading related products
    this.relatedProducts = [
      {
        id: 2,
        name: "Men's Running Shoe",
        description: 'Lightweight and cushioned running shoe.',
        price: 89.39,
        image: 'products/running-shoe.png',
        stock: 7,
        targetAudience: TargetAudience.Men,
        brand: 'Adidas',
      },
      {
        id: 3,
        name: "Men's Casual Sneaker",
        description: 'A versatile casual sneaker.',
        price: 74.39,
        image: 'products/casual-sneaker.png',
        stock: 5,
        targetAudience: TargetAudience.Men,
        brand: 'Puma',
      },
    ];
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  openImageModal() {
    // Implement image modal functionality
    console.log('Open image modal');
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  isSizeAvailable(size: string): boolean {
    // Simulate size availability
    return Math.random() > 0.3; // 70% chance of being available
  }

  increaseQuantity() {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product || !this.selectedSize) {
      this.snackBar.open(
        'Please select a size before adding to cart',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
      return;
    }

    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);

    this.snackBar
      .open(`${this.product.name} added to cart!`, 'View Cart', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      })
      .onAction()
      .subscribe(() => {
        // Navigate to cart
        console.log('Navigate to cart');
      });
  }

  buyNow() {
    if (!this.product || !this.selectedSize) {
      this.snackBar.open('Please select a size before purchasing', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    // Add to cart and proceed to checkout
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);

    this.snackBar.open('Proceeding to checkout...', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    // Navigate to checkout
    console.log('Navigate to checkout');
  }

  toggleWishlist() {
    this.isInWishlist = !this.isInWishlist;
    const message = this.isInWishlist
      ? 'Added to wishlist'
      : 'Removed from wishlist';

    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  getDiscountPercentage(): number {
    if (!this.product || !this.product.originalPrice) return 0;
    return Math.round(
      ((this.product.originalPrice - this.product.price) /
        this.product.originalPrice) *
        100
    );
  }
}
