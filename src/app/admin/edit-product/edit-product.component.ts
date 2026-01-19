import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AdminProductApiService } from '../../services/api';
import { ToastService } from '../../services/toast.service';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { BarcodeScannerModalComponent } from '../barcode-scanner-modal/barcode-scanner-modal.component';
import {
  BrandDto,
  ProductAudienceDto,
  AdminProductDto,
  ProductFeatureDto,
  ProductSizeDto,
} from '@dtos';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit, OnDestroy {
  productData: AdminProductDto | null = null;
  productId!: number;
  brands: BrandDto[] = [];
  productAudience: ProductAudienceDto[] = [];
  discountText = '';
  priceText = '';
  isLoading = false;

  newSpec: ProductFeatureDto = {
    id: 0,
    sortOrder: 0,
    featureText: '',
  };

  newSize: ProductSizeDto = {
    id: 0,
    size: 0,
    stock: 0,
    barcode: '',
    sku: '',
  };

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private adminProductApiService: AdminProductApiService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.toastService.error('Invalid product ID');
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.toastService.error('Invalid product ID');
      return;
    }

    this.productId = id;
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit(): void {
    if (!this.productData) {
      return;
    }

    this.isLoading = true;
    this.productData.price = Number(this.priceText);
    this.productData.discountPercentage = Number(this.discountText);

    this.subscriptions.add(
      this.adminProductApiService
        .updateProduct(this.productId, this.productData)
        .subscribe({
          next: () => {
            this.toastService.success('Product updated successfully.');
            this.isLoading = false;
            this.loadProductData();
          },
          error: () => {
            this.toastService.error('Failed to update product.');
            this.isLoading = false;
          },
        }),
    );
  }

  addSpecification(): void {
    if (
      !this.productData ||
      !this.newSpec.sortOrder ||
      !this.newSpec.featureText
    ) {
      return;
    }

    if (!this.productData.productFeatures) {
      this.productData.productFeatures = [];
    }

    this.productData.productFeatures.push({
      id: 0,
      featureText: this.newSpec.featureText,
      sortOrder: this.newSpec.sortOrder,
    });

    this.newSpec = {
      id: 0,
      sortOrder: 0,
      featureText: '',
    };
  }

  removeSpecification(index: number): void {
    this.productData?.productFeatures?.splice(index, 1);
  }

  addSize(): void {
    if (!this.productData) {
      return;
    }

    if (!this.productData.productSizes) {
      this.productData.productSizes = [];
    }

    this.productData.productSizes.push({
      id: 0,
      size: this.newSize.size,
      stock: this.newSize.stock ?? 0,
      barcode: this.newSize.barcode,
      sku: this.newSize.sku ?? '',
    });

    this.newSize = {
      id: 0,
      size: 0,
      stock: 0,
      barcode: '',
      sku: '',
    };
  }

  removeSize(index: number): void {
    this.productData?.productSizes?.splice(index, 1);
  }

  openBarcodeScanner() {
    const modalRef = this.modalService.open(BarcodeScannerModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.result.then(
      (barcode: string) => {
        if (barcode) {
          this.newSize.barcode = barcode;
          this.toastService.success(`Barcode scanned: ${barcode}`);
        }
      },
      () => {},
    );
  }

  openBarcodeScannerForSize(index: number) {
    const modalRef = this.modalService.open(BarcodeScannerModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.result.then(
      (barcode: string) => {
        if (
          barcode &&
          this.productData?.productSizes &&
          this.productData.productSizes[index]
        ) {
          this.productData.productSizes[index].barcode = barcode;
          this.toastService.success(`Barcode scanned: ${barcode}`);
        }
      },
      () => {},
    );
  }

  allowDecimalOnly(event: KeyboardEvent): void {
    const allowed = /[0-9.]/;
    if (!allowed.test(event.key)) {
      event.preventDefault();
      return;
    }

    if (
      event.key === '.' &&
      (event.target as HTMLInputElement).value.includes('.')
    ) {
      event.preventDefault();
    }
  }

  normalizeDiscount(): void {
    const value = Number(this.discountText);
    if (!isNaN(value) && this.productData) {
      this.discountText = value.toFixed(2);
      this.productData.discountPercentage = value;
    } else {
      this.discountText = '';
    }
  }

  normalizePrice(): void {
    const value = Number(this.priceText);
    if (!isNaN(value) && this.productData) {
      this.priceText = value.toFixed(2);
      this.productData.price = value;
    } else {
      this.priceText = '';
    }
  }

  deleteProduct(): void {
    if (!this.productData) {
      return;
    }

    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Delete Product';
    modalRef.componentInstance.message = `Are you sure you want to delete "${this.productData.name}"?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result: boolean) => {
      if (result) {
        this.isLoading = true;
        this.subscriptions.add(
          this.adminProductApiService
            .deleteProduct(this.productData!.id)
            .subscribe({
              next: () => {
                this.toastService.success('Product deleted successfully');
                this.isLoading = false;
                this.router.navigate(['/admin/products']);
              },
              error: () => {
                this.isLoading = false;
                this.toastService.error('Failed to delete product');
              },
            }),
        );
      }
    });
  }

  private initializeData(): void {
    this.getProductAudience();
    this.getProductBrands();
    this.loadProductData();
  }

  private getProductBrands(): void {
    this.subscriptions.add(
      this.adminProductApiService.getProductBrands().subscribe({
        next: (response) => {
          this.brands = response;
        },
        error: () => {
          this.toastService.error('Failed to load product brands.');
        },
      }),
    );
  }

  private getProductAudience(): void {
    this.subscriptions.add(
      this.adminProductApiService.getProductAudience().subscribe({
        next: (response) => {
          this.productAudience = response;
        },
        error: () => {
          this.toastService.error('Failed to load product audience options.');
        },
      }),
    );
  }

  private loadProductData(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminProductApiService
        .getProductById(this.productId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (response) => {
            this.productData = response;
            this.priceText = this.productData.price?.toFixed(2) ?? '';
            this.discountText =
              this.productData.discountPercentage?.toFixed(2) ?? '';

            if (!this.productData.productSizes) {
              this.productData.productSizes = [];
            }
          },
          error: () => {
            this.toastService.error('Failed to load product data.');
          },
        }),
    );
  }
}
