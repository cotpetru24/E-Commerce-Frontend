import { Component } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardContent, MatCardActions, MatInputModule, MatCardContent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
