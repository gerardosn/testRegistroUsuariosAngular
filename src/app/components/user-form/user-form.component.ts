import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';

function emailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  if (!email) return null;
  
  const hasAtSymbol = email.includes('@');
  const hasDot = email.includes('.');
  const isValidFormat = hasAtSymbol && hasDot && email.indexOf('@') < email.lastIndexOf('.');
  
  return isValidFormat ? null : { invalidEmail: true };
}

function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const phone = control.value;
  if (!phone) return null;
  
  // Remove spaces and hyphens for validation
  const cleanPhone = phone.replace(/[\s-]/g, '');
  // Count only digits
  const digitCount = cleanPhone.replace(/[^\d]/g, '').length;
  
  if (digitCount < 10) {
    return { minDigits: true };
  }
  
  // Allow plus symbol only at the start
  if (cleanPhone.includes('+') && !cleanPhone.startsWith('+')) {
    return { invalidFormat: true };
  }
  
  return null;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="user-form">
      <h2>{{ isEditing ? 'Edit User' : 'Registro de usuario.' }}</h2>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="form-container">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Nombre:</label>
              <input id="name" type="text" formControlName="name" placeholder="Enter name">
              <div class="error-message" *ngIf="userForm.get('name')?.errors?.['required'] && userForm.get('name')?.touched">
                Name is required
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input id="email" type="email" formControlName="email" placeholder="Enter email">
              <div class="error-message" *ngIf="userForm.get('email')?.errors?.['required'] && userForm.get('email')?.touched">
                Email is required
              </div>
              <div class="error-message" *ngIf="userForm.get('email')?.errors?.['invalidEmail'] && userForm.get('email')?.touched">
                Email no válido
              </div>
            </div>

            <div class="form-group">
              <label for="phone">Teléfono:</label>
              <input id="phone" type="tel" formControlName="phone" placeholder="Enter phone">
              <div class="error-message" *ngIf="userForm.get('phone')?.errors?.['required'] && userForm.get('phone')?.touched">
                Phone is required
              </div>
              <div class="error-message" *ngIf="userForm.get('phone')?.errors?.['minDigits'] && userForm.get('phone')?.touched">
                Phone must have at least 10 digits
              </div>
              <div class="error-message" *ngIf="userForm.get('phone')?.errors?.['invalidFormat'] && userForm.get('phone')?.touched">
                Plus symbol (+) must be at the start
              </div>
            </div>

            <div class="form-group submit-group">
              <label class="invisible">Submit:</label>
              <div class="button-group">
                <button type="submit" [disabled]="!userForm.valid" class="action-btn submit-btn" [title]="isEditing ? 'Save Changes' : 'Add User'">
                  <span class="btn-icon">{{ isEditing ? '✓' : '+' }}</span>
                </button>
                <button *ngIf="isEditing" type="button" class="action-btn cancel-btn" (click)="cancelEdit()" title="Cancel Edit">
                  <span class="btn-icon">✕</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .user-form {
      margin: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .form-container {
      display: flex;
      flex-direction: column;
    }

    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: flex-start;
    }

    .form-group {
      flex: 1;
      min-width: 200px;
      position: relative;
    }

    .submit-group {
      flex: 0 0 auto;
      min-width: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .invisible {
      visibility: hidden;
      height: 21px; /* Match other labels height */
      margin-bottom: 5px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #555;
    }

    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
    }

    .button-group {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
      padding: 0;
    }

    .submit-btn {
      background-color: #4CAF50;
      color: white;
    }

    .submit-btn:hover:not(:disabled) {
      background-color: #45a049;
    }

    .submit-btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .cancel-btn {
      background-color: #f44336;
      color: white;
    }

    .cancel-btn:hover {
      background-color: #d32f2f;
    }

    .btn-icon {
      font-size: 24px;
      font-weight: bold;
      line-height: 1;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
      position: absolute;
    }

    @media (max-width: 768px) {
      .form-group {
        flex: 1 1 calc(50% - 10px);
      }
      
      .submit-group {
        flex: 0 0 auto;
      }
    }

    @media (max-width: 480px) {
      .form-group:not(.submit-group) {
        flex: 1 1 100%;
      }
      
      .submit-group {
        flex: 0 0 auto;
      }
    }
  `]
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  isEditing = false;
  private editingUser: User | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, emailValidator]],
      phone: ['', [Validators.required, phoneValidator]]
    });
  }

  ngOnInit(): void {
    this.subscription = this.userService.getEditingUser().subscribe(user => {
      this.editingUser = user;
      this.isEditing = !!user;
      
      if (user) {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone
        });
      } else {
        this.userForm.reset();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.isEditing && this.editingUser) {
        this.userService.updateUser({
          ...this.editingUser,
          ...this.userForm.value
        });
      } else {
        this.userService.addUser(this.userForm.value);
      }
      this.userForm.reset();
    }
  }

  cancelEdit(): void {
    this.userService.setEditingUser(null);
  }
}