import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductDto } from '../../models/product.dto';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Audience } from '../../models/gender.enum';
import { Toast} from 'bootstrap';
import { SpinneComponent } from "../../shared/spinner/spinner.component";

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SpinneComponent
],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('errorToast') errorToastRef!: ElementRef;

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
    private toastService: ToastService,
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
        imagePath: 'products/retro-sneaker.png',
        stock: 10,
        audience: Audience.Men,
        brandName: 'Nike',
      },
      {
        id: 2,
        name: "Men's Running Shoe",
        description:
          'Lightweight and cushioned. The perfect running shoe for your daily tune.',
        price: 89.39,
        imagePath: 'products/running-shoe.png',
        stock: 7,
        audience: Audience.Men,
        brandName: 'Adidas',
      },
      {
        id: 3,
        name: "Men's Casual Sneaker",
        description:
          "A versatile men's casual sneaker with a minimal and stylish design.",
        price: 74.39,
        imagePath: 'products/casual-sneaker.png',
        stock: 5,
        audience: Audience.Men,
        brandName: 'Puma',
      },
      {
        id: 4,
        name: "Women's Elegant Heel",
        description:
          'Elegant and comfortable heel perfect for formal occasions.',
        price: 99.99,
        imagePath: 'products/retro-sneaker2.png',
        stock: 8,
        audience: Audience.Women,
        brandName: 'Steve Madden',
      },
      {
        id: 5,
        name: "Children's Play Shoe",
        description:
          'Durable and comfortable shoes perfect for active children.',
        price: 45.99,
        imagePath: 'products/casual-sneaker.png',
        stock: 12,
        audience: Audience.Children,
        brandName: 'Skechers',
      },
      {
        id: 6,
        name: "Women's Athletic Shoe",
        description:
          'High-performance athletic shoes for women who love to stay active.',
        price: 79.99,
        imagePath: 'products/running-shoe.png',
        stock: 6,
        audience: Audience.Women,
        brandName: 'Under Armour',
      },
            {
        id: 7,
        name: "Women's Athletic Shoe",
        description:
          'High-performance athletic shoes for women who love to stay active.',
        price: 79.99,
        imagePath: 'products/running-shoe.png',
        stock: 6,
        audience: Audience.Women,
        brandName: 'Under Armour',
      },
            {
        id: 8,
        name: "Women's Athletic Shoe",
        description:
          'High-performance athletic shoes for women who love to stay active.',
        price: 79.99,
        imagePath: 'products/running-shoe.png',
        stock: 6,
        audience: Audience.Women,
        brandName: 'Under Armour',
      },
            {
        id: 9,
        name: "Women's Athletic Shoe",
        description:
          'High-performance athletic shoes for women who love to stay active.',
        price: 79.99,
        imagePath: 'products/running-shoe.png',
        stock: 6,
        audience: Audience.Women,
        brandName: 'Under Armour',
      },
            {
        id: 10,
        name: "Women's Athletic Shoe",
        description:
          'High-performance athletic shoes for women who love to stay active.',
        price: 79.99,
        imagePath: 'products/running-shoe.png',
        stock: 6,
        audience: Audience.Women,
        brandName: 'Under Armour',
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


  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    // Create toast element dynamically
    const toastHtml = `
      <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    
    // Create container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    // Add toast to container
    toastContainer.innerHTML = toastHtml;
    const toastElement = toastContainer.querySelector('.toast') as HTMLElement;
    
    // Initialize and show toast
    const toast = new Toast(toastElement, {
      autohide: true,
      delay: 3000
    });
    toast.show();
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
    size=size.toLowerCase();
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
