import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductDto, ProductDtoSchema } from '../../models/product.dto';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Audience } from '../../models/audience.enum';
import { ProductApiService } from '../../services/api';
import {
  ProductFilterDto,
  SortByOption,
} from '../../models/product-filter.dto';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  // SortBy = SortByOption;

  public products: ProductDto[] = [];

  public audienceOptions: Audience[] = [
    Audience.Men,
    Audience.Women,
    Audience.Children,
    Audience.Unisex,
  ];

  public sortByOptions: { value: SortByOption; label: string }[] = [
    { value: SortByOption.NameAsc, label: 'Name A-Z' },
    { value: SortByOption.NameDesc, label: 'Name Z-A' },
    { value: SortByOption.PriceAsc, label: 'Price Low to High' },
    { value: SortByOption.PriceDesc, label: 'Price High to Low' },
    { value: SortByOption.BrandAsc, label: 'Brand A-Z' },
    { value: SortByOption.BrandDesc, label: 'Brand Z-A' },
  ];

  public productFilterDto: ProductFilterDto = {};

  availableBrands: string[] = [];

  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private toastService: ToastService,
    private productApi: ProductApiService
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
    this.productApi.getProducts(this.productFilterDto).subscribe({
      next: (response) => {
        try {
          this.products = response.products.map((item) =>
            ProductDtoSchema.parse(item)
          );
          this.availableBrands = response.brands;
        } catch (err) {
          console.error('Validation failed', err);
          this.toastService.error('Product data is invalid');
        }
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.toastService.error('Error loading products');
      },
    });
  }

  getPageTitle(): string {
    if (this.productFilterDto.Audience) {
      return `${
        this.productFilterDto.Audience.charAt(0).toUpperCase() +
        this.productFilterDto.Audience.slice(1)
      }'s Shoes`;
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
    this.productFilterDto = {};
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

  quickView(product: ProductDto) {
    // Implement quick view functionality
    console.log('Quick view:', product);
  }

  addToCart(product: ProductDto) {
    // For product list, add with default size and quantity
    this.cartService.addToCart(product, 1);
    this.toastService.success(`${product.name} added to cart!`);
  }
}
