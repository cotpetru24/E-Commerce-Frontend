import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
} from '@zxing/library';

@Component({
  selector: 'app-barcode-scanner-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barcode-scanner-modal.component.html',
  styleUrls: ['./barcode-scanner-modal.component.scss'],
})
export class BarcodeScannerModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  isCameraActive = false;
  private codeReader: BrowserMultiFormatReader | null = null;
  private stream: MediaStream | null = null;
  private isScanning = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.codeReader = new BrowserMultiFormatReader();

    const hints = new Map();

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
      BarcodeFormat.PDF_417,
    ]);

    hints.set(DecodeHintType.TRY_HARDER, true);

    this.codeReader.hints = hints;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.startCamera();
    }, 100);
  }

  async startCamera() {
    if (!this.codeReader || !this.videoElement) return;

    try {
      const videoInputDevices = await this.codeReader.listVideoInputDevices();

      let selectedDeviceId: string | undefined;
      for (const device of videoInputDevices) {
        if (
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        ) {
          selectedDeviceId = device.deviceId;
          break;
        }
      }

      if (!selectedDeviceId && videoInputDevices.length > 0) {
        selectedDeviceId = videoInputDevices[0].deviceId;
      }

      const video = this.videoElement.nativeElement;

      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('muted', 'true');

      this.codeReader.decodeFromVideoDevice(
        selectedDeviceId || null,
        video,
        (result) => {
          if (result) {
            const barcode = result.getText();
            this.onBarcodeDetected(barcode);
          }
        },
      );

      this.isCameraActive = true;
    } catch (error: any) {
      this.toastService.error(
        'Failed to start camera. Please check permissions.',
      );
      console.error('Camera error:', error);

      if (error.name === 'NotAllowedError') {
        this.toastService.error(
          'Camera permission denied. Please allow camera access in browser settings.',
        );
      }
    }
  }

  onBarcodeDetected(barcode: string) {
    this.stopCamera();
    this.activeModal.close(barcode);
    this.toastService.success(`Barcode scanned: ${barcode}`);
  }

  stopCamera() {
    if (this.codeReader) {
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
