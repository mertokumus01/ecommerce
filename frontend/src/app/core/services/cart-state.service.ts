import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartState {
  orderId: number | null;
  itemCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private readonly cartStateSubject = new BehaviorSubject<CartState>({
    orderId: null,
    itemCount: 0
  });

  readonly cartState$ = this.cartStateSubject.asObservable();

  setCartState(state: CartState): void {
    this.cartStateSubject.next(state);
  }

  clearCartState(): void {
    this.cartStateSubject.next({ orderId: null, itemCount: 0 });
  }
}
