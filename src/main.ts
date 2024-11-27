import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { UserFormComponent } from './app/components/user-form/user-form.component';
import { UserListComponent } from './app/components/user-list/user-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserFormComponent, UserListComponent],
  template: `
    <div class="container">
      <h1>Usuarios registrados App</h1>
      <app-user-form></app-user-form>
      <app-user-list></app-user-list>
    </div>
  `,
  styles: [
    `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }
  `,
  ],
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
