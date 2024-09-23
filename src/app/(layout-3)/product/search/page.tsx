"use client"
import Box from "@component/Box";
import SearchResult from "./SearchResult";
import { useState, useEffect, Suspense } from "react";
import apiList from "@utils/__api__/apiList";
import axios from "axios";
import { defaults } from "config/default";
import Notification from "@component/Notification";
import { useSearchParams } from "next/navigation";
import { tokens } from "@utils/utils";
// ==============================================================
interface Props {
  params: { slug: string };
  page: { pageNo: string };
}
// ==============================================================

export default function ProductSearchResult({ params }: Props) {

  const token = tokens();
  const searchParams = useSearchParams()
  const query = searchParams.get('query');
  const [notificatonData, setNotificationData] = useState({ 'status': false });
  const [currentPage, setCurrentPage] = useState(1);
  const locationResponse = localStorage.getItem('locationResponse');
  const storeCode: string = JSON.parse(locationResponse).storecode;
  const [resultList, setResultList] = useState<string[]>([]);

  const handleSearch = async () => {
    try {
      if (storeCode) {
        const response = await axios({
          url: `${apiList.GLOBAL_SEARCH}?q=${query}&page=${currentPage}`,
          method: 'GET',
          headers: {
            storecode: storeCode
          }
        });

        setResultList(response.data.data.suggestions);
        return response;
      }
    } catch (error) {
      console.log('Error in handleAddToCart:', error);
      throw error; // Re-throw to handle it in the calling function
    }
  }


  useEffect(() => {
    handleSearch();
  }, [query]); // Make sure to include inventoryFetchData in the dependency array


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Box pt="20px">
        <SearchResult query={query} productData={resultList && resultList} setNotificationData={setNotificationData} storeCode={storeCode} token={token} />
      </Box>
    </Suspense>
  );
}

