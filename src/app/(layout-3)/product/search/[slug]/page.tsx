"use client"
import Box from "@component/Box";
import SearchResult from "./SearchResult";
import { useState, useEffect,Suspense } from "react";
import apiList from "@utils/__api__/apiList";
import useAxios from "custom/useAxios";
import { defaults } from "config/default";
import Notification from "@component/Notification";
import { useSearchParams } from "next/navigation";
// ==============================================================
interface Props {
  params: { slug: string };
  page: { pageNo: string };
}
// ==============================================================

export default function ProductSearchResult({ params }: Props) {
  const [storeCode, setStoreCode] = useState('');
  const [token, setToken] = useState('');
  const searchParams = useSearchParams()
  const type = searchParams.get('type');
  const search = searchParams.get('subcategories')
  const [notificatonData, setNotificationData] = useState({ 'status': false });
  const [currentPage, setCurrentPage] = useState(1);
  const [subCategory, setSubCategory] = useState(null);

  // const products = await api.getProductByCategory(params.slug as string, currentPage);
  const { response: productResponse, error: productError, loading: productLoading, fetchData: productFetchData } = useAxios();
 

  const fetchData = async () => {
    try {
      const datas = {
        category: decodeURI(params.slug)
      }
      // Call API for product by category
      await productFetchData({ url: apiList.PRODUCT_BY_CATEGORY + currentPage, method: "POST", data: datas, params: null, headers: { storecode: defaults.storecode } });

    } catch (error) {
      console.log("Error fetching inventory data:", error);
    }
  };

  const fetchDataBySubCategory = async () => {
    try {
      const datas = {
        subcategory: subCategory
      }
      // Call API for product by category
      await productFetchData({ url: `${apiList.PRODUCT_BY_SUB_CATEGORY}?page=${currentPage}&subcategory=${subCategory}`, method: "GET", data: {}, params: {}, headers: { storecode: defaults.storecode } });

    } catch (error) {
      console.log("Error fetching inventory data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []); // Make sure to include inventoryFetchData in the dependency array
  useEffect(() => {
    if (subCategory !== null) {
      fetchDataBySubCategory();
    }

  }, [subCategory]);
  useEffect(() => {
    const locationResponse = localStorage.getItem('locationResponse');
    const userData = localStorage.getItem('userData');

    if (locationResponse !== null) {
      try {
        const parsedData = JSON.parse(locationResponse);
        if (parsedData && parsedData.storecode) {
          setStoreCode(parsedData.storecode);
        } else {
          console.error("Location response does not contain 'storecode'");
        }
      } catch (error) {
        // Handle parsing errors here
        console.error("Error parsing location response:", error);
      }
    }

    if (userData) {
      setToken(JSON.parse(userData).token);
    }
  }, []);


  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Box pt="20px">
      <SearchResult sortOptions={sortOptions} subcategory={search && search} productData={productResponse && productResponse.data} subCat={setSubCategory} setNotificationData={setNotificationData} storeCode={storeCode} token={token} />
    </Box>
    </Suspense>
  );
}

 