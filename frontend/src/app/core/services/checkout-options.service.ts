import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShippingMethodDto {
  shippingMethodId: number;
  shippingName: string;
  shippingDescription: string;
  shippingPrice: number;
  active: boolean;
}

export interface PaymentMethodDto {
  paymentMethodId: number;
  paymentName: string;
  paymentDescription: string;
  paymentIcon: string;
  active: boolean;
}

export interface CityDto {
  cityId: number;
  cityName: string;
  cityCode: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutOptionsService {
  private shippingUrl = `${environment.apiUrl}/shipping-methods`;
  private paymentUrl = `${environment.apiUrl}/payment-methods`;
  private citiesUrl = `${environment.apiUrl}/cities`;

  constructor(private http: HttpClient) {}

  getShippingMethods(): Observable<ShippingMethodDto[]> {
    return this.http.get<ShippingMethodDto[]>(this.shippingUrl);
  }

  getPaymentMethods(): Observable<PaymentMethodDto[]> {
    return this.http.get<PaymentMethodDto[]>(this.paymentUrl);
  }

  getCities(): Observable<CityDto[]> {
    return this.http.get<CityDto[]>(this.citiesUrl);
  }
}
