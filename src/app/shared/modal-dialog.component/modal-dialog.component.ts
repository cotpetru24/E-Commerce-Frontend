import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderStatus } from '../../models';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="activeModal.dismiss()"
      ></button>
    </div>

    <div class="modal-body">
      <!-- Default message -->
      <p *ngIf="modalType === 'confirm'">{{ message }}</p>

      <p *ngIf="modalType === 'updateOrderStatus'">{{ message }}</p>

      <div *ngIf="modalType === 'updateOrderStatus'">
        <div *ngFor="let option of options" class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            [checked]="option.checked"
            (change)="option.checked = !option.checked"
            [id]="'option-' + option.value"
          />
          <label class="form-check-label" [for]="'option-' + option.value">
            {{ option.label }}
          </label>
        </div>
      </div>
    </div>

    <div *ngIf="modalType === 'confirm'" class="modal-footer">
      <button class="btn btn-danger" (click)="onConfirm()">Yes</button>
      <button class="btn btn-secondary" (click)="activeModal.dismiss()">No</button>
    </div>

    <div *ngIf="modalType === 'updateOrderStatus'" class="modal-footer">
      <button class="btn btn-danger" (click)="onConfirm()">Update</button>
      <button class="btn btn-secondary" (click)="activeModal.dismiss()">Cancel</button>
    </div>
  `,
})
export class ModalDialogComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() modalType: 'confirm' | 'updateOrderStatus' = 'confirm';
  @Input() options: { label: string; value: OrderStatus; checked?: boolean }[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  onConfirm(): void {
    if (this.modalType === 'updateOrderStatus') {
      const selected = this.options
        .filter(o => o.checked)
        .map(o => o.value);
      this.activeModal.close(selected);
    } else {
      this.activeModal.close(true);
    }
  }
}
