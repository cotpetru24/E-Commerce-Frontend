import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  AdminProductDto,
  GetProductsAdminRequestDto,
  GetProductsAdminResponseDto,
  ProductDto,
  ProductsSortBy,
  ProductsSortDirection,
  ProductStatus,
  ProductStockStatus,
} from '../../models/product.dto';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { Audience } from '../../models';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import is from 'zod/v4/locales/is.cjs';
import { BarcodeScannerModalComponent } from '../barcode-scanner-modal/barcode-scanner-modal.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
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

  public productStatus: ProductStatus[] = [
    ProductStatus.Active,
    ProductStatus.Inactive,
  ];

  public productStockStatus: ProductStockStatus[] = [
    ProductStockStatus.LowStock,
    ProductStockStatus.HighStock,
    ProductStockStatus.InStock,
    ProductStockStatus.OutOfStock,
  ];

  // Search and filters
  searchTerm = '';
  selectedCategory: Audience | null = null;
  selectedBrand: string | null = null;
  isActive: boolean | null = null;
  selectedStock: ProductStockStatus | null = null;
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
    private toastService: ToastService,
    private modalService: NgbModal
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
    }

    const getProductsAdminRequest: GetProductsAdminRequestDto = {
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      searchTerm: this.searchTerm,
      isActive: this.isActive,
      productCategory: this.selectedCategory,
      productBrand: this.selectedBrand,
      productStockStatus: this.selectedStock,
      sortDirection:
        sortDir === 'asc'
          ? ProductsSortDirection.Ascending
          : ProductsSortDirection.Descending,
      sortBy: this.sortField,
    };

    this.subscriptions.add(
      this.adminApi.getAllProducts(getProductsAdminRequest).subscribe({
        next: (response) => {
          this.response = response;
          // this.adminProductsStats = response.adminUsersStats;
          // this.totalPages = response.totalPages;
          // this.totalQueryCount = response.totalQueryCount;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
          this.toastService.error('Failed to load products');
        },
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

    openBarcodeScanner() {
      const modalRef = this.modalService.open(BarcodeScannerModalComponent, {
        size: 'lg',
        centered: true,
      });
  
      modalRef.result.then(
        (scannedBarcode: string) => {
          // Store in temp variable
          this.searchTerm = scannedBarcode;
  
 
this.onFilterChange();


          this.toastService.success(`Barcode scanned: ${scannedBarcode}`);
        },
        (dismissed) => {
          // Modal was dismissed
        }
      );
    }

  updatePagination(): void {
    if (!this.isLoading) {
      this.loadProducts();
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= (this.response?.totalPages ?? 1)) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(
      1,
      (this.response?.pageNumber ?? 0) - Math.floor(maxVisible / 2)
    );
    let end = Math.min(this.response?.totalPages ?? 0, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  //   getCategoryClass(category: Audience): string {
  //   if (category.toLowerCase() === Audience.Men) return 'bg-primary';
  //   if (category.toLowerCase() === Audience.Women) return 'bg-pink';
  //   if (category.toLowerCase() === Audience.Children) return 'bg-yellow';
  //   if (category.toLowerCase() === Audience.Unisex) return 'bg-yellowgreen';
  //   return 'text-success';
  // }

  getCategoryClass(category: string): string {
    switch (category.toLowerCase()) {
      case Audience.Men:
        return 'bg-men';
      case Audience.Women:
        return 'bg-women';
      case Audience.Children:
        return 'bg-children';
      case Audience.Unisex:
        return 'bg-success';
      default:
        return 'bg-success';
    }
  }

  // getStockBadgeClass(stock: number): string {
  //   if (stock <= 0) return 'badge bg-danger';
  //   if (stock < 10) return 'badge bg-warning';
  //   return 'badge bg-success';
  // }

  getStockBadgeClass(stock: number): string {
    if (stock <= 0) return 'bg-danger';
    if (stock < 10) return 'bg-warning';
    if (stock > 50) return 'bg-info';

    return 'bg-success';
  }

  getStockQuantityClass(stock: number): string {
    if (stock <= 0) return 'text-danger fw-bold';
    if (stock < 10) return 'text-warning fw-bold';
    if (stock > 50) return 'text-info fw-bold';

    return 'text-success';
  }

  getStockText(stock: number): string {
    if (stock <= 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    if (stock > 50) return 'High Stock';

    return 'In Stock';
  }

  editProduct(product: AdminProductDto): void {
    this.router.navigate(['/admin/edit-product', product.id]);
  }

  viewProduct(product: AdminProductDto): void {
    // Navigate to product detail view
    this.router.navigate(['/products/details', product.id], {
      queryParams: { from: 'product-management' },
    });
  }

  resetFilters(): void {
    this.searchTerm = '';

    this.selectedCategory = null;
    this.selectedBrand = null;
    this.isActive = null;
    this.selectedStock = null;
    this.sortBy = 'date-desc';

    this.loadProducts();
  }

  deleteProduct(product: AdminProductDto): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Delete Product';
    modalRef.componentInstance.message = `Are you sure you want to delete "${product.name}"?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result=> {
      if (result === true) {
        this.isLoading = true;

      this.subscriptions.add(
        this.adminApi.deleteProduct(product.id).subscribe({
          next: () => {
            this.toastService.success('Product deleted successfully');
            this.isLoading = false;
            this.loadProducts();
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error deleting product:', error);
            this.toastService.error('Failed to delete product');
          },
        })
      );

    }}))

}}
