import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductDto, ProductSizeDto } from '../../models/product.dto';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductApiService } from '../../services/api';
import { ProductImageDto } from '../../models/product-image.dto';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDto | null = null;
  cameFromProductManagement: boolean = false;
  cameFromAdminDashboard: boolean = false;
  relatedProducts: ProductDto[] = [];
  additionalProductImages: ProductImageDto[] = [];
  selectedImage: string = '';
  rating: number = 4.5;
  reviewCount: number = 128;
  selectedSize?: ProductSizeDto;
  quantity: number = 1;
  isInWishlist: boolean = false;
  productFeatures: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private toastService: ToastService,
    private productApi: ProductApiService,
    private router: Router,
    private utilsService: UtilsService
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
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  navigateToProductDetails(productId: number) {
    this.router.navigate(['/products/details', productId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectSize(size: ProductSizeDto) {
    this.selectedSize = size;
    this.quantity = 1;
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

  getDiscountPercentage(): number {
    if (!this.product || !this.product.originalPrice) return 0;
    return Math.round(
      ((this.product.originalPrice - this.product.price) /
        this.product.originalPrice) *
        100
    );
  }

  getPrimaryImage(images: ProductImageDto[]): string {
    let primaryImage = images?.find((img) => img.isPrimary);
    return primaryImage
      ? primaryImage.imagePath
      : 'products/image-coming-soon.png';
  }
}
