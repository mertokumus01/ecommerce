import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderItemRequest {
  orderItemQuantity: number;
  orderItemPrice: number;
  orderId: number;
  productId: number;
}

export interface OrderItemResponse {
  orderItemId: number;
  orderItemQuantity: number;
  orderItemPrice: number;
  orderId: number;
  productId: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private apiUrl = `${environment.apiUrl}/order-items`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrderItemResponse[]> {
    return this.http.get<OrderItemResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<OrderItemResponse> {
    return this.http.get<OrderItemResponse>(`${this.apiUrl}/${id}`);
  }

  getByOrderId(orderId: number): Observable<OrderItemResponse[]> {
    return this.http.get<OrderItemResponse[]>(`${this.apiUrl}/order/${orderId}`);
  }

  create(orderItem: OrderItemRequest): Observable<OrderItemResponse> {
    return this.http.post<OrderItemResponse>(this.apiUrl, orderItem);
  }

  update(id: number, orderItem: OrderItemRequest): Observable<OrderItemResponse> {
    return this.http.put<OrderItemResponse>(`${this.apiUrl}/${id}`, orderItem);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
