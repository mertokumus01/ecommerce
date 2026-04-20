/**
 * Product Model
 */
export interface Product {
  productId?: number;
  id?: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productCreateDate?: Date;
  createdDate?: Date;
  createdAt?: Date;
  categoryId: number;
}

export interface ProductRequest {
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  categoryId: number;
}

export interface ProductResponse {
  success: boolean;
  data?: Product | Product[];
  message?: string;
}
