"use client";

import { useMemo, useEffect, useState, useReducer, useContext, createContext, PropsWithChildren } from "react";
import axios from 'axios';
import apiList from '@utils/__api__/apiList';
// TYPES
import { ActionType, InitialState, ContextProps } from "./types";

interface CartItem {
  id: number | string;
  slug: string;
  price: number;
  imgUrl: string;
  name: string;
  qty: number;
  productVariant: string;
  maxQuantity: number;
  limit:number;
  size:any;
}

const fetchCartData = async (token:string,storeCode:string) => {
 

  try {
    const response = await axios({
      url: apiList.SHOPING_BAG,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        storecode: storeCode,
      },
    });

    const cartItems = response.data.data.items.map((item: any) => ({
      id: item.productId,
      slug: item.slug,
      price: item.supplies[0].mrp - item.supplies[0].off,
      imgUrl: item.imageUrl,
      name: item.name,
      qty: item.quantity,
      productVariant: item.variantId,
      maxQuantity: item.supplies[0].quantity,
      limit: item.limit,
      mrp:item.supplies[0].mrp
      
    }));
    
    return cartItems;
  } catch (error) {
    console.error('Failed to fetch cart data', error);
    return [];
  }
};

const isClient = typeof window !== 'undefined';
const INITIAL_STATE = {
  cart: [],
  isHeaderFixed: false,
  userData: isClient ? localStorage.getItem('userData') : '',
  userInfo: isClient ? localStorage.getItem('userInfo') : ''
};

export const AppContext = createContext<ContextProps>({
  state: INITIAL_STATE,
  dispatch: () => { }
});

const reducer = (state: InitialState, action: ActionType) => {
  switch (action.type) {
    case "INITIALIZE_CART":
  return { ...state, cart: action.payload };
    case "TOGGLE_HEADER":
      return { ...state, isHeaderFixed: action.payload };
    case "UPDATE_USER_DATA":
      return { ...state, userData: action.payload };
    case "USER_DETAILS":
      return { ...state, userInfo: action.payload };
  
    case "CHANGE_CART_AMOUNT":
      const cartList = state.cart;
      const cartItem = action.payload;
    
      const exist = cartList.find((item) => item.productVariant === cartItem.productVariant);

      if (cartItem.qty < 1) {
        return { ...state, cart: cartList.filter((item) => item.productVariant !== cartItem.productVariant) };
      }

      if (exist) {
        return {
          ...state,
          cart: cartList.map((item) =>
            item.productVariant === cartItem.productVariant ? { ...item, qty: cartItem.qty } : item
          )
        };
      }

      return { ...state, cart: [...cartList, cartItem] };
    default:
      return state;
  }
};

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userData') || '{}').token;
    const storeCode = JSON.parse(localStorage.getItem('locationResponse') || '{}').storecode;
    const initializeCart = async () => {
      if(token!=undefined && storeCode!=undefined){
        const cartItems = await fetchCartData(token,storeCode);
        dispatch({ type: "INITIALIZE_CART", payload: cartItems });
      }
     
     
    };

    initializeCart();
  }, []);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext<ContextProps>(AppContext);
