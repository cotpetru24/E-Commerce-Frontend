import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductApiService } from '../../services/api';
import { finalize } from 'rxjs';
import { Utils } from 'app/shared/utils';
import { ProductFilterDto, ProductDto, ProductImageDto } from '@dtos';
import { AudienceEnum, AudienceMeta, ProductSortByOption } from '@dtos/enums';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  availableBrands: string[] = [];
  isLoading: boolean = false;
  AudienceMeta = AudienceMeta;
  viewMode: 'grid' | 'list' = 'grid';

  audienceOptions: AudienceEnum[] = [
    AudienceEnum.Men,
    AudienceEnum.Women,
    AudienceEnum.Children,
    AudienceEnum.Unisex,
  ];

  sortByOptions: { value: ProductSortByOption; label: string }[] = [
    { value: ProductSortByOption.NameAsc, label: 'Name A-Z' },
    { value: ProductSortByOption.NameDesc, label: 'Name Z-A' },
    { value: ProductSortByOption.PriceAsc, label: 'Price Low to High' },
    { value: ProductSortByOption.PriceDesc, label: 'Price High to Low' },
    { value: ProductSortByOption.BrandAsc, label: 'Brand A-Z' },
    { value: ProductSortByOption.BrandDesc, label: 'Brand Z-A' },
  ];

  productFilterDto: ProductFilterDto = {
    Brand: null,
    Size: null,
    Audience: null,
    SortBy: null,
    MaxPrice: null,
    MinPrice: null,
    Page: null,
    PageSize: null,
    SearchTerm: null,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private toastService: ToastService,
    private productApi: ProductApiService,
    private utils: Utils,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const audience = params['audience'];
      if (audience) {
        this.setFilters({ Audience: audience });
      } else {
        this.getProducts();
      }
    });
  }

  getProducts() {
    this.isLoading = true;
    this.productApi
      .getProducts(this.productFilterDto)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          try {
            this.products = response.products;
            this.availableBrands = response.brands;
          } catch {
            this.toastService.error('Product data is invalid');
          }
        },
        error: () => {
          this.toastService.error('Error loading products');
        },
      });
  }

  getPageTitle(): string {
    if (this.productFilterDto.Audience) {
      return `${AudienceMeta[this.productFilterDto.Audience].label}'s Shoes`;
    }
    return 'All Products';
  }

  getPageSubtitle(): string {
    if (this.productFilterDto.Audience) {
      return `Discover our collection of ${this.productFilterDto.Audience}'s footwear`;
    }
    return 'Browse our complete collection of stylish and comfortable shoes';
  }

  setFilters(value: Partial<ProductFilterDto>) {
    this.productFilterDto = { ...this.productFilterDto, ...value };
    this.getProducts();
  }

  clearFilters() {
    this.productFilterDto = {
      Brand: null,
      Size: null,
      Audience: null,
      SortBy: null,
      MaxPrice: null,
      MinPrice: null,
      Page: null,
      PageSize: null,
      SearchTerm: null,
    };
    this.getProducts();
  }

  onSearchTermClear(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value === '') {
      this.getProducts();
    }
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  navigateToProductDetails(productId: number) {
    this.utils.scrollToTop();
    this.router.navigate(['/products/details', productId]);
  }

  getPrimaryImage(images: ProductImageDto[]): string {
    let primaryImage = images?.find((img) => img.isPrimary);
    return primaryImage
      ? primaryImage.imagePath
      : 'products/image-coming-soon.png';
  }
}
