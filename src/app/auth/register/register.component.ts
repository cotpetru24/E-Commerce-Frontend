import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormGroup } from '@angular/forms';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatSpinner, MatInputModule, MatOption, MatIcon, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public registerForm!: FormGroup;

  public hidePassword: boolean = true;
  public isLoading: boolean = false;
  public hideConfirmPassword:boolean=false;





public onSubmit():void{


}

}
