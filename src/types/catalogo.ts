export interface GlobalCategory {
  id: string;
  name: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface GlobalProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  global_category_id: string | null;
  category_default: string | null;
  is_active: boolean;
  created_at: string;
  global_categories?: {
    id: string;
    name: string;
  } | null;
}
