import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);
  private editingUser = new BehaviorSubject<User | null>(null);

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getEditingUser(): Observable<User | null> {
    return this.editingUser.asObservable();
  }

  setEditingUser(user: User | null): void {
    this.editingUser.next(user);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): void {
    const newUser = {
      ...user,
      id: this.users.length + 1,
      createdAt: new Date()
    };
    this.users.push(newUser);
    this.usersSubject.next([...this.users]);
  }

  updateUser(updatedUser: User): void {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = { ...updatedUser };
      this.usersSubject.next([...this.users]);
      this.editingUser.next(null);
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
    this.usersSubject.next([...this.users]);
  }
}