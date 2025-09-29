import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-dialog',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-danger" (click)="activeModal.close(true)">Yes</button>
      <button class="btn btn-secondary" (click)="activeModal.dismiss()">No</button>
    </div>
  `
})
export class ModalDialogComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';

  constructor(public activeModal: NgbActiveModal) {}
}
