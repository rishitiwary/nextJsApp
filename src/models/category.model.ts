interface Category {
  subcategories: string | number | boolean | readonly string[] | readonly number[] | readonly boolean[];
  imageUrl:string;
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parent: string[];
  featured?: boolean;
  description?: string;
}

export default Category;
