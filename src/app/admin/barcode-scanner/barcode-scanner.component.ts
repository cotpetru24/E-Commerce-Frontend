import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnInit {
  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;

  scanMode = 'camera';
  isCameraActive = false;
  scannedBarcode = '';
  manualBarcode = '';
  quantityToAdd = 1;
  
  foundProduct: any = null;
  productNotFound = false;
  
  recentScans = [
    {
      productName: 'Nike Air Max 270',
      barcode: '1234567890123',
      quantityAdded: 5,
      timestamp: new Date('2024-01-15 14:30:00')
    },
    {
      productName: 'Adidas Ultraboost 22',
      barcode: '9876543210987',
      quantityAdded: 3,
      timestamp: new Date('2024-01-15 13:45:00')
    }
  ];

  // Mock product database
  productDatabase = [
    {
      barcode: '1234567890123',
      name: 'Nike Air Max 270',
      brandName: 'Nike',
      price: 129.99,
      stock: 25,
      imagePath: 'assets/products/running-shoe.png'
    },
    {
      barcode: '9876543210987',
      name: 'Adidas Ultraboost 22',
      brandName: 'Adidas',
      price: 179.99,
      stock: 15,
      imagePath: 'assets/products/casual-sneaker.png'
    }
  ];

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Initialize scanner
  }

  setScanMode(mode: string) {
    this.scanMode = mode;
    this.resetScanner();
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = stream;
        this.isCameraActive = true;
        this.toastService.success('Camera started successfully!');
      }
    } catch (error) {
      this.toastService.error('Failed to start camera. Please check permissions.');
      console.error('Camera error:', error);
    }
  }

  stopCamera() {
    if (this.videoElement && this.videoElement.nativeElement.srcObject) {
      const stream = this.videoElement.nativeElement.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track: MediaStreamTrack) => track.stop());
      this.isCameraActive = false;
      this.toastService.info('Camera stopped');
    }
  }

  captureBarcode() {
    // Simulate barcode scanning
    // In a real implementation, you would use a barcode scanning library
    // like QuaggaJS or ZXing to decode the barcode from the video stream
    
    const mockBarcodes = ['1234567890123', '9876543210987', '5556667778889'];
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    
    this.scannedBarcode = randomBarcode;
    this.processBarcode(randomBarcode);
    
    this.toastService.success(`Barcode scanned: ${randomBarcode}`);
  }

  processManualBarcode() {
    if (this.manualBarcode.trim()) {
      this.processBarcode(this.manualBarcode.trim());
      this.toastService.success(`Processing barcode: ${this.manualBarcode}`);
    } else {
      this.toastService.error('Please enter a barcode');
    }
  }

  processBarcode(barcode: string) {
    // Search for product in database
    const product = this.productDatabase.find(p => p.barcode === barcode);
    
    if (product) {
      this.foundProduct = { ...product };
      this.productNotFound = false;
      this.toastService.success(`Product found: ${product.name}`);
    } else {
      this.foundProduct = null;
      this.productNotFound = true;
      this.toastService.warning('Product not found in database');
    }
  }

  updateStock() {
    if (this.foundProduct && this.quantityToAdd > 0) {
      // Simulate API call to update stock
      setTimeout(() => {
        this.foundProduct.stock += this.quantityToAdd;
        
        // Add to recent scans
        this.recentScans.unshift({
          productName: this.foundProduct.name,
          barcode: this.foundProduct.barcode,
          quantityAdded: this.quantityToAdd,
          timestamp: new Date()
        });
        
        this.toastService.success(`Stock updated! Added ${this.quantityToAdd} units to ${this.foundProduct.name}`);
        this.resetScanner();
      }, 1000);
    } else {
      this.toastService.error('Please enter a valid quantity');
    }
  }

  addNewProduct() {
    const barcode = this.scannedBarcode || this.manualBarcode;
    if (barcode) {
      // Navigate to add product page with barcode pre-filled
      this.router.navigate(['/admin/add-product'], { 
        queryParams: { barcode: barcode } 
      });
    }
  }

  resetScanner() {
    this.scannedBarcode = '';
    this.manualBarcode = '';
    this.foundProduct = null;
    this.productNotFound = false;
    this.quantityToAdd = 1;
  }

  exportScanHistory() {
    // Implement export functionality
    this.toastService.info('Export functionality coming soon!');
  }

  viewInventory() {
    this.router.navigate(['/admin/products']);
  }

  scanSettings() {
    // Implement scanner settings
    this.toastService.info('Scanner settings coming soon!');
  }

  ngOnDestroy() {
    this.stopCamera();
  }
} 