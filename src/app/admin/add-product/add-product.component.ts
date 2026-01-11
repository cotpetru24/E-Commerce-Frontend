import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';
import { BarcodeScannerModalComponent } from '../barcode-scanner-modal/barcode-scanner-modal.component';
import {
  AdminBrandDto,
  AdminProductAudienceDto,
  AdminProductDto,
  AdminProductFeatureDto,
  ProductSizeDto,
} from '../../models';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})

export class AddProductComponent implements OnInit, OnDestroy {
  productData: AdminProductDto = this.createEmptyProduct();
  isLoading = false;
  discountText = '';
  priceText = '';
  brands: AdminBrandDto[] = [];
  productAudience: AdminProductAudienceDto[] = [];

  newSpec: AdminProductFeatureDto = {
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
    private adminApiService: AdminApiService,
    private modalService: NgbModal,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getProductBrands();
    this.getProductAudience();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit() {
    if (
      !this.productData.name ||
      !this.productData.price ||
      !this.productData.audienceId ||
      !this.productData.brandId ||
      !this.productData.description
    ) {
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;
    this.productData.price = Number(this.priceText);
    this.productData.discountPercentage = Number(this.discountText);

    this.subscriptions.add(
      this.adminApiService
        .createProduct(this.productData)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            this.toastService.success('Product added successfully!');
            this.router.navigate(['/admin/products']);
          },
          error: () => {
            this.toastService.error('Failed to create product.');
          },
        })
    );
  }

  addSpecification() {
    if (this.newSpec.sortOrder && this.newSpec.featureText) {
      this.productData?.productFeatures?.push({
        id: 0,
        featureText: this.newSpec.featureText,
        sortOrder: this.newSpec.sortOrder,
      });
      this.newSpec.sortOrder = 0;
      this.newSpec.featureText = '';
    }
  }

  removeSpecification(index: number) {
    this.productData?.productFeatures?.splice(index, 1);
  }

  addSize() {
    if (this.newSize.size && this.newSize.barcode) {
      if (!this.productData?.productSizes) {
        this.productData!.productSizes = [];
      }
      this.productData?.productSizes?.push({
        id: 0,
        size: this.newSize.size,
        stock: this.newSize.stock || 0,
        barcode: this.newSize.barcode,
      });
      this.newSize = {
        id: 0,
        size: 0,
        stock: 0,
        barcode: '',
        sku: '',
      };
    }
  }

  removeSize(index: number) {
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
      () => {}
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
      () => {}
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

  normalizeDiscount() {
    const value = Number(this.discountText);
    if (!isNaN(value)) {
      this.discountText = value.toFixed(2);
      this.productData!.discountPercentage = value;
    } else {
      this.discountText = '';
    }
  }

  normalizePrice() {
    const value = Number(this.priceText);
    if (!isNaN(value)) {
      this.priceText = value.toFixed(2);
      this.productData!.price = value;
    } else {
      this.priceText = '';
    }
  }

  private getProductBrands() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService
        .getProductBrands()
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (response) => {
            this.brands = response;
          },
        })
    );
  }

  private getProductAudience() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService
        .getProductAudience()
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (response) => {
            this.productAudience = response;
          },
        })
    );
  }

  private createEmptyProduct(): AdminProductDto {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
      audienceId: 0,
      brandName: '',
      brandId: 0,
      productSizes: [] as ProductSizeDto[],
      productFeatures: [],
      productImages: [],
      isNew: false,
      discountPercentage: 0,
      selected: false,
      isActive: true,
      totalStock: 0,
    };
  }
}
