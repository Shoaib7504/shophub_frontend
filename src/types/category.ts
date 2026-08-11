export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  image?: string | null;
}
