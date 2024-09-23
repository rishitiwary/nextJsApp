"use client"
import { useState, useEffect } from "react";
import apiList from '@utils/__api__/apiList';
import useAxios from 'custom/useAxios';
const HandleCart = (quantity: number, id: string | number, productVariant: number) => {
    const { response: cartResponse, error: cartError, loading: cartLoading, fetchData: cartData } = useAxios();
    const [storeCode, setStoreCode] = useState('');
    const [token, setToken] = useState('');
   

    // call api for storing data into database through api
    const handleAddToCartFn = async () => {
        const datas = {
            "quantity": quantity,
            "productId": id,
            "productVariantId": productVariant
        }

        try {
            if (token && storeCode) {
                await cartData({
                    url: apiList.SHOPING_BAG,
                    method: 'POST',
                    data: datas,
                    params: null,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        storecode: storeCode
                    }
                });

            }
        } catch (error) {
            console.log(error);
        }
    }
 

    handleAddToCartFn();

 
}

export default HandleCart;


export const testFn=()=>{
    const { response: cartResponse, error: cartError, loading: cartLoading, fetchData: cartData } = useAxios();
console.log('yess');
}