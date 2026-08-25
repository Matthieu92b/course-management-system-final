import { Injectable, signal } from '@angular/core';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly request = signal<ConfirmRequest | null>(null);
  private resolver: ((result: boolean) => void) | null = null;

  ask(message: string, opts: Partial<Omit<ConfirmRequest, 'message'>> = {}): Promise<boolean> {
    this.request.set({
      title: opts.title ?? 'Please confirm',
      message,
      confirmLabel: opts.confirmLabel ?? 'Confirm',
      cancelLabel: opts.cancelLabel ?? 'Cancel',
      danger: opts.danger ?? false
    });
    return new Promise(resolve => { this.resolver = resolve; });
  }

  resolve(result: boolean) {
    this.request.set(null);
    this.resolver?.(result);
    this.resolver = null;
  }
}
