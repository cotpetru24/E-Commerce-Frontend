import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderStatus } from '../../dtos';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-dialog.component.html',
})

export class ModalDialogComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() modalType: 'confirm' | 'updateOrderStatus' = 'confirm';
  @Input() options: { label: string; value: OrderStatus; checked?: boolean }[] = [];

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  onConfirm(): void {
    if (this.modalType === 'updateOrderStatus') {
      const selected = this.options
        .filter((o) => o.checked)
        .map((o) => o.value);
      this.activeModal.close(selected);
    } else {
      this.activeModal.close(true);
    }
  }
}
