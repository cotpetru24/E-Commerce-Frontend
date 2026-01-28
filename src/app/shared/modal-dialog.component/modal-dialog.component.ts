import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderStatusEnum } from '@dtos';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-dialog.component.html',
})
export class ModalDialogComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() modalType: 'confirm' | 'updateOrderStatus' | 'saveAs' = 'confirm';
  @Input() options: { label: string; value: OrderStatusEnum; checked?: boolean }[] =
    [];
  @Input() saveAs = '';

  constructor(public activeModal: NgbActiveModal) {}

  onConfirm(): void {
    if (this.modalType === 'updateOrderStatus') {
      const selected = this.options
        .filter((o) => o.checked)
        .map((o) => o.value);
      this.activeModal.close(selected);
    } else if (this.modalType === 'saveAs') {
      this.activeModal.close(this.saveAs);
    } else {
      this.activeModal.close(true);
    }
  }
}
