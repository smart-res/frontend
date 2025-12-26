export type CategoryStatus = "active" | "inactive";

export type MenuCategory = {
  _id: string;
  name: string;
  description?: string;
  displayOrder?: number;
  status: "active" | "inactive";
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
