import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetProductsAdminRequestDto, GetProductsAdminResponseDto, ProductDto, ProductsSortBy, ProductsSortDirection, ProductStatus, ProductStockStatus } from '../../models/product.dto';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { Audience } from '../../models';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  // Products data
  response?: GetProductsAdminResponseDto;  
  filteredProducts: ProductDto[] = [];
  paginatedProducts: ProductDto[] = [];
  isLoading = false;

  public audienceOptions: Audience[] = [
    Audience.Men,
    Audience.Women,
    Audience.Children,
    Audience.Unisex,
  ];

  public productStatus : ProductStatus[] = [
    ProductStatus.Active,
    ProductStatus.Inactive,
  ];

  public productStockStatus : ProductStockStatus[] = [
    ProductStockStatus.LowStock,
    ProductStockStatus.HighStock,
    ProductStockStatus.InStock,
    ProductStockStatus.OutOfStock,
  ];

  // Search and filters
  searchTerm = '';
  selectedCategory : Audience | null = null;
  selectedBrand = '';
  isActive : boolean | null = null;
  selectedStock : ProductStockStatus | null = null;
  sortBy = 'date-desc';
  sortField: ProductsSortBy = ProductsSortBy.DateCreated;


  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalQueryCount = 0;

  // Math utility for template
  Math = Math;

  private subscriptions = new Subscription();

  constructor(
    private adminApi: AdminApiService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProducts(): void {
    this.isLoading = true;

    const [sortByField, sortDir] = this.sortBy.split('-');

          switch (sortByField) {
            case 'name':
              this.sortField = ProductsSortBy.Name;
              break;
            case 'stock':
              this.sortField = ProductsSortBy.Stock;
              break;
            case 'date':
            default:
              this.sortField = ProductsSortBy.DateCreated;
              break;
        };

        const getProductsAdminRequest: GetProductsAdminRequestDto = {
          pageNumber: this.currentPage,
          pageSize: this.itemsPerPage,
          searchTerm: this.searchTerm,
          isActive: this.isActive,
          productCategory: this.selectedCategory,
          productBrand: this.selectedBrand,
          productStockStatus: this.selectedStock,
          sortDirection: sortDir === 'asc'
              ? ProductsSortDirection.Ascending
              : ProductsSortDirection.Descending,
          sortBy: this.sortField,
        }



    
    this.subscriptions.add(
      this.adminApi.getAllProducts(getProductsAdminRequest).subscribe({
        next: (response) => {
          this.response = response;
          // this.adminProductsStats = response.adminUsersStats;
          // this.totalPages = response.totalPages;
          // this.totalQueryCount = response.totalQueryCount;
          this.isLoading = false;        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
          this.toastService.error('Failed to load products');
        }
      })
    );
  }

  onSearchChange(): void {
    this.currentPage = 1;
    // this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }



  updatePagination(): void {
    if (!this.isLoading) {
      this.loadProducts();
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= (this.response?.totalPages?? 1)) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, (this.response?.pageNumber ?? 0) - Math.floor(maxVisible / 2));
    let end = Math.min((this.response?.totalPages ?? 0), start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'text-danger fw-bold';
    if (stock < 10) return 'text-warning fw-bold';
    return 'text-success';
  }

  getStatusClass(stock: number): string {
    if (stock === 0) return 'badge bg-danger';
    if (stock < 10) return 'badge bg-warning';
    return 'badge bg-success';
  }

  getStatusText(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'Active';
  }

  editProduct(product: ProductDto): void {
    this.router.navigate(['/admin/edit-product', product.id]);
  }

  viewProduct(product: ProductDto): void {
    // Navigate to product detail view
    this.router.navigate(['/products', product.id]);
  }

  deleteProduct(product: ProductDto): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.subscriptions.add(
        this.adminApi.deleteProduct(product.id).subscribe({
          next: () => {
            this.toastService.success('Product deleted successfully');
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.toastService.error('Failed to delete product');
          }
        })
      );
    }
  }
}
