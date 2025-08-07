import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductDto } from '../../models/product.dto';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Audience } from '../../models/audience.enum';
import { ProductApiService } from '../../services/api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  public product: ProductDto | null = null;

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
    private toastService: ToastService,
    private productApi: ProductApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId: number = Number(params['id']);

      if (productId !== undefined || productId !== null) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(productId: number) {
    this.getProduct(productId);
    if (this.product) {
      this.initializeProductData();
      this.loadRelatedProducts();
    }
  }

  getProduct(id: number) {
    this.productApi.getProductById(id).subscribe({
      next: (response) => {
        this.product = response;
      },
    });
  }

  initializeProductData() {
    if (!this.product) return;

    // Set up product images
    this.productImages = [
      this.product.imagePath,
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
        imagePath: 'products/running-shoe.png',
        stock: 7,
        audience: Audience.Men,
        brandName: 'Adidas',
      },
      {
        id: 3,
        name: "Men's Casual Sneaker",
        description: 'A versatile casual sneaker.',
        price: 74.39,
        imagePath: 'products/casual-sneaker.png',
        stock: 5,
        audience: Audience.Men,
        brandName: 'Puma',
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
    size = size.toLowerCase();
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

  addToCart(): void {
    if (!this.product || !this.selectedSize) {
      this.toastService.warning('Please select a size before adding to cart');
      return;
    }

    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
    this.toastService.success(`${this.product.name} added to cart!`);
  }

  buyNow() {
    if (!this.product || !this.selectedSize) {
      this.toastService.warning('Please select a size before purchasing');
      return;
    }

    // Add to cart and proceed to checkout
    this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
    this.toastService.info('Proceeding to checkout...');

    // Navigate to checkout
    console.log('Navigate to checkout');
  }

  toggleWishlist() {
    this.isInWishlist = !this.isInWishlist;
    // const message = this.isInWishlist
    //   ? 'Added to wishlist'
    //   : 'Removed from wishlist';

    // // this.toast.open(message, 'Close', {
    // //   duration: 2000,
    // //   horizontalPosition: 'center',
    // //   verticalPosition: 'bottom',
    // // });
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
