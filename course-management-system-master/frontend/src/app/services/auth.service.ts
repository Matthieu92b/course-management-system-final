import { Injectable, computed, signal } from '@angular/core';
import { LoginResponse, Role } from '../models/models';

const STORAGE_KEY = 'cms.currentUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<LoginResponse | null>(this.readFromStorage());
  readonly role = computed<Role | null>(() => {
    const role = this.currentUser()?.role?.toUpperCase();
    return role === 'ADMIN' || role === 'LECTURER' || role === 'STUDENT' ? role : null;
  });
  readonly isAdmin = computed(() => this.role() === 'ADMIN');
  readonly isLecturer = computed(() => this.role() === 'LECTURER');
  readonly isStudent = computed(() => this.role() === 'STUDENT');

  setCurrentUser(user: LoginResponse) {
    this.currentUser.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private readFromStorage(): LoginResponse | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
