import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-barcode-scanner-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barcode-scanner-modal.component.html',
  styleUrls: ['./barcode-scanner-modal.component.scss']
})
export class BarcodeScannerModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  isCameraActive = false;
  private codeReader: BrowserMultiFormatReader | null = null;
  private stream: MediaStream | null = null;
  private isScanning = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Initialize ZXing barcode reader
    this.codeReader = new BrowserMultiFormatReader();
    
    // Configure hints for better barcode detection
    const hints = new Map();
    
    // Enable all common barcode formats
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_93,
      BarcodeFormat.CODABAR,
      BarcodeFormat.ITF,
      BarcodeFormat.RSS_14,
      BarcodeFormat.RSS_EXPANDED,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.AZTEC,
      BarcodeFormat.PDF_417
    ]);
    
    // Try harder for better detection
    hints.set(DecodeHintType.TRY_HARDER, true);
    
    // Set hints on the reader
    this.codeReader.hints = hints;
    
    console.log('✅ ZXing barcode reader initialized with all formats');
  }

  ngAfterViewInit() {
    // Start camera after view is initialized
    setTimeout(() => {
      this.startCamera();
    }, 100);
  }

  async startCamera() {
    if (!this.codeReader || !this.videoElement) return;

    try {
      const videoInputDevices = await this.codeReader.listVideoInputDevices();
      
      // Find back camera (environment facing)
      let selectedDeviceId: string | undefined;
      for (const device of videoInputDevices) {
        if (device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')) {
          selectedDeviceId = device.deviceId;
          break;
        }
      }
      
      // If no back camera found, use first available
      if (!selectedDeviceId && videoInputDevices.length > 0) {
        selectedDeviceId = videoInputDevices[0].deviceId;
      }

      const video = this.videoElement.nativeElement;
      
      // Configure video constraints for better scanning
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('muted', 'true');
      
      // Start decoding from video element with continuous scanning
      this.codeReader.decodeFromVideoDevice(
        selectedDeviceId || null,
        video,
        (result, error) => {
          if (result) {
            // Barcode detected!
            const barcode = result.getText();
            const format = result.getBarcodeFormat();
            console.log('✅ Barcode detected:', barcode, 'Format:', format);
            this.onBarcodeDetected(barcode);
          }
          
          if (error && error.name !== 'NotFoundException') {
            // NotFoundException is normal when no barcode is in view
            // Only log other errors for debugging
            console.debug('Scanning...', error.name);
          }
        }
      );

      this.isCameraActive = true;
      console.log('✅ Camera started and scanning...');
      
    } catch (error: any) {
      this.toastService.error('Failed to start camera. Please check permissions.');
      console.error('Camera error:', error);
      
      // If permission denied, show helpful message
      if (error.name === 'NotAllowedError') {
        this.toastService.error('Camera permission denied. Please allow camera access in browser settings.');
      }
    }
  }

  onBarcodeDetected(barcode: string) {
    // Stop scanning and close modal
    this.stopCamera();
    this.activeModal.close(barcode);
    this.toastService.success(`Barcode scanned: ${barcode}`);
  }

  stopCamera() {
    if (this.codeReader) {
      // Stop all video tracks
      this.codeReader.reset();
    }
    
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track: MediaStreamTrack) => track.stop());
      this.stream = null;
    }
    
    if (this.videoElement) {
      const video = this.videoElement.nativeElement;
      video.srcObject = null;
    }
    
    this.isCameraActive = false;
    this.isScanning = false;
  }

  cancel() {
    this.stopCamera();
    this.activeModal.dismiss();
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}


