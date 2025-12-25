import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductDto, ProductSizeDto } from '../../models/product.dto';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Audience } from '../../models/audience.enum';
import { ProductApiService } from '../../services/api';
import { firstValueFrom } from 'rxjs';
import { ProductImageDto } from '../../models/product-image.dto';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  public product: ProductDto | null = null;

  public cameFromProductManagement: boolean = false;
  public cameFromAdminDashboard: boolean = false;

  public relatedProducts: ProductDto[] = [];

  public additionalProductImages: ProductImageDto[] = [];

  selectedImage: string = '';
  rating: number = 4.5;
  reviewCount: number = 128;
  selectedSize?: ProductSizeDto;
  quantity: number = 1;
  maxQuantity: number = 10;
  isInWishlist: boolean = false;
  productFeatures: string[] = [];
  availableSizes: string[] = ['7', '8', '9', '10', '11', '12'];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private toastService: ToastService,
    private productApi: ProductApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId: number = Number(params['id']);

      if (productId !== undefined || productId !== null) {
        this.getProduct(productId);
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.cameFromProductManagement = params['from'] === 'product-management';
      this.cameFromAdminDashboard = params['from'] === 'admin-dashboard';
    });
  }

  getProduct(id: number) {
    this.productApi.getProductById(id).subscribe({
      next: (response) => {
        this.product = response.product;
        this.relatedProducts = response.relatedProducts || [];
        // this.additionalProductImages = response.additionalImages || [];

        if (this.product) {
          this.initializeProductData();
        }
      },
    });
  }

  initializeProductData() {
    if (!this.product) return;

    if ((this.product?.productImages?.length ?? 0) > 0) {
      this.selectedImage =
        this.product?.productImages.find((img) => img.isPrimary)?.imagePath ||
        this.product?.productImages[0]?.imagePath ||
        '';
    } else {
      this.selectedImage = 'products/image-coming-soon.png';
    }

    // Set up product features
    this.productFeatures = [
      'Breathable mesh upper',
      'Cushioned midsole for comfort',
      'Durable rubber outsole',
      'Lightweight construction',
      'Available in multiple colors',
    ];

    // Set max quantity based on stock
    this.maxQuantity = Math.min(this.product.totalStock, 10);
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  openImageModal() {
    console.log('Open image modal');
  }

  navigateToProductDetails(productId: number) {
    this.router.navigate(['/products/details', productId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectSize(size: ProductSizeDto) {
    this.selectedSize = size;
    this.quantity = 1;
  }

  isSizeAvailable(size: string): boolean {
    size = size.toLowerCase();
    return Math.random() > 0.3; // 70% chance of being available
  }

  increaseQuantity() {
    if (this.quantity < this.selectedSize?.stock!) {
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

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize.size
    );
    this.toastService.success(`${this.product.name} added to cart!`);
  }

  buyNow() {
    if (!this.product || !this.selectedSize) {
      this.toastService.warning('Please select a size before purchasing');
      return;
    }

    // Add to cart and proceed to checkout
    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize.size
    );
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
