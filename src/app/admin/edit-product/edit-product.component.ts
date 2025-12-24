import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import { BarcodeScannerModalComponent } from '../barcode-scanner-modal/barcode-scanner-modal.component';
import {
  AdminBrandDto,
  AdminProductAudienceDto,
  AdminProductDto,
  AdminProductFeatureDto,
  ProductDto,
  ProductSizeDto,
} from '../../models';
import { error } from 'console';
import { number } from 'zod';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  productData: AdminProductDto | null = null;
  productId!: number;
  brands: AdminBrandDto[] = [];
  productAudience: AdminProductAudienceDto[] = [];

  discountText = '';
  priceText = '';

  newSpec: AdminProductFeatureDto = {
    id: 0,
    sortOrder: 0,
    featureText: '',
  };

  newSize: ProductSizeDto = {
    size: 0,
    stock: 0,
    barcode: '',
    sku: '',
  };

  // Temp variable to store scanned barcode
  scannedBarcodeTemp: string = '';

  isLoading = false;
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private adminApiService: AdminApiService,
    private modalService: NgbModal
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
    this.initialiseData();
    // this.getProductBrands();
    // this.loadProductData();
  }

  initialiseData() {
    this.getProductAudience();
    this.getProductBrands();
    this.loadProductData();
  }

  getProductBrands() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService.getProductBrands().subscribe({
        next: (response) => {
          this.brands = response;
          // this.loadProductData();
        },
      })
    );
  }

  getProductAudience() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService.getProductAudience().subscribe({
        next: (response) => {
          this.productAudience = response;
          // this.loadProductData();
        },
      })
    );
  }

  loadProductData() {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminApiService.getProductById(this.productId).subscribe({
        next: (response) => {
          this.productData = response;

          this.priceText = this.productData.price?.toFixed(2) ?? '';
          this.discountText =
            this.productData.discountPercentage?.toFixed(2) ?? '';

          // Initialize sizes array if it doesn't exist
          if (!this.productData.productSizes) {
            this.productData.productSizes = [];
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching product data:', error);
          this.toastService.error('Failed to load product data.');
          this.isLoading = false;
        },
      })
    );
  }

  onSubmit() {
    this.isLoading = true;

    this.productData!.price = Number(this.priceText);
    this.productData!.discountPercentage = Number(this.discountText);
    this.subscriptions.add(
      this.adminApiService
        .updateProduct(this.productId, this.productData!)
        .subscribe({
          next: (response) => {
            this.toastService.success('Product updated successfully.');
            this.isLoading = false;
            this.loadProductData();
          },
          error: (error) => {
            console.error('Error fetching product data:', error);
            this.toastService.error('Failed to load product data.');
            this.isLoading = false;
          },
        })
    );

    this.loadProductData();
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

  allowDecimalOnly(event: KeyboardEvent) {
    const allowed = /[0-9.]/;
    if (!allowed.test(event.key)) {
      event.preventDefault();
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

  removeSpecification(index: number) {
    this.productData?.productFeatures?.splice(index, 1);
  }

addSize() {
if (!this.productData) return;

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
      size: 0,
      stock: 0,
      barcode: '',
      sku: '',
    };
  }



  removeSize(index: number) {
    this.productData?.productSizes?.splice(index, 1);
  }

  openBarcodeScanner(sizeIndex?: number) {
    const modalRef = this.modalService.open(BarcodeScannerModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.result.then(
      (scannedBarcode: string) => {
        // Store in temp variable
        this.scannedBarcodeTemp = scannedBarcode;

        // If sizeIndex is provided, update that specific size's barcode
        if (sizeIndex !== undefined && this.productData?.productSizes) {
          this.productData.productSizes[sizeIndex].barcode = scannedBarcode;
        } else {
          // Otherwise, update the newSize barcode
          this.newSize.barcode = scannedBarcode;
        }

        this.toastService.success(`Barcode scanned: ${scannedBarcode}`);
      },
      (dismissed) => {
        // Modal was dismissed
      }
    );
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // this.productData.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    // this.productData.images.splice(index, 1);
  }

  deleteProduct(): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Delete Product';
    modalRef.componentInstance.message = `Are you sure you want to delete "${this.productData?.name}"?`;
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result=> {
      if (result === true) {
        this.isLoading = true;

      this.subscriptions.add(
        this.adminApiService.deleteProduct(this.productData!.id).subscribe({
          next: () => {
            this.toastService.success('Product deleted successfully');
            this.isLoading = false;
            this.router.navigate(['/admin/products']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error deleting product:', error);
            this.toastService.error('Failed to delete product');
          },
        })
      );

    }}))

}
}
