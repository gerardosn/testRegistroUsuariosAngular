import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list">
      <h2>Usuarios registrados</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users$ | async">
              <td>{{user.createdAt | date:'dd/MM/yyyy HH:mm:ss'}}</td>
              <td>{{user.name}}</td>
              <td>{{user.email}}</td>
              <td>{{user.phone}}</td>
              <td>
                <div class="action-buttons">
                  <button class="edit-btn" (click)="editUser(user)" title="Edit user">
                    <span class="edit-icon">✎</span>
                  </button>
                  <button class="delete-btn" (click)="deleteUser(user.id)" title="Delete user">
                    <span class="delete-icon">×</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="(users$ | async)?.length === 0">No users registered yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .user-list {
      margin: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    tr:hover {
      background-color: #f5f5f5;
    }
    .action-buttons {
      display: flex;
      gap: 8px;
    }
    .edit-btn, .delete-btn {
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }
    .edit-btn {
      background-color: #2196F3;
      color: white;
    }
    .edit-btn:hover {
      background-color: #1976D2;
    }
    .delete-btn {
      background-color: #ff4444;
      color: white;
    }
    .delete-btn:hover {
      background-color: #cc0000;
    }
    .edit-icon, .delete-icon {
      font-size: 16px;
      font-weight: bold;
      line-height: 1;
    }
    h2 {
      color: #333;
      margin-bottom: 20px;
    }
    @media (max-width: 768px) {
      .table-container {
        font-size: 14px;
      }
      th, td {
        padding: 8px;
      }
      .edit-btn, .delete-btn {
        width: 25px;
        height: 25px;
      }
      .edit-icon, .delete-icon {
        font-size: 14px;
      }
    }
  `]
})
export class UserListComponent {
  users$ = this.userService.getUsers();

  constructor(private userService: UserService) {}

  editUser(user: User): void {
    this.userService.setEditingUser(user);
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id);
  }
}