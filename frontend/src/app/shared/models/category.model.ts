/**
 * Category Model
 */
export interface Category {
  categoryId?: number;
  id?: number;
  categoryName: string;
  categoryDescription?: string;
  categoryDecription?: string;
}

export interface CategoryRequest {
  categoryName: string;
  categoryDescription?: string;
}

export interface CategoryResponse {
  success: boolean;
  data?: Category | Category[];
  message?: string;
}
