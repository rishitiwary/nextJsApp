import Shop from "./shop.model";
import Review from "./Review.model";

interface Product {
  data: any;
  sizes: any;
  name: string;
  category?:string;
  products?:any[];
  unit?: any;
  slug: string;
  price: number;
  title: string;
  rating: number;
  discount: number;
  thumbnail: string;
  id: string;
  shop?: Shop;
  brand?: string;
  size?: string[];
  status?: string;
  colors?: string[];
  images?: string[];
  categories: any[];
  reviews?: Review[];
  published?: boolean;
  productVariant?:number;
  limit?:number;
  
}

export default Product;
