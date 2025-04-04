export interface IUser {
  _id: string;
  googleId?: string;
  username?: string;
  email: string;
  password?: string;
}
export interface ICategory {
  _id: string;
  name: string;
  subcategory: ISubcategory;
}

export interface ISubcategory {
  _id: string;
  name: string;
}
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  imageUrls: string[];
  condition: string;
  region: string;
  city: string;
  address: string;
  phone: number;
  category: ICategory;
  subcategory: ISubcategory;
  userId: IUser;
}
