import axios from "@lib/axios";
import Product from "@models/product.model";
import Shop from "@models/shop.model";
// CUSTOM DATA MODEL
import { SlugParams } from "interfaces";
import apiList from "./apiList";
import { defaults } from "config/default";
import {baseUrl} from "config/baseUrl";
// get all product slug
const getSlugs = async (): Promise<SlugParams[]> => {
  const response = await axios.get("/api/products/slug-list");
  return response.data;
};

// get product based on slug
const getProduct = async (slug: string): Promise<Product> => {
  const response = await axios.get(apiList.PRODUCT_DETAILS+slug, {headers:{storecode:defaults.storecode}});

  return response.data;
};
// get product based on category
const getProductByCategory = async (slug: string,pageNo:number): Promise<Product> => {
  const response = await axios.post(apiList.PRODUCT_BY_CATEGORY+pageNo,{'category':decodeURI(slug)}, {headers:{storecode:defaults.storecode}});
  return response.data;
};
const getFrequentlyBought = async (): Promise<Product[]> => {
  const response = await axios.get("/api/frequently-bought-products");
  return response.data;
};

const getRelatedProducts = async (): Promise<Product[]> => {
  const response = await axios.get("/api/related-products");
  return response.data;
};

const getAvailableShop = async (): Promise<Shop[]> => {
  const response = await axios.get("/api/product/shops");
  return response.data;
};

export default { getSlugs, getProduct, getProductByCategory,getFrequentlyBought, getRelatedProducts, getAvailableShop };
