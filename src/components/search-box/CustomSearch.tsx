import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";

import Box from "@component/Box";
import Menu from "@component/Menu";
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import MenuItem from "@component/MenuItem";
import { Span } from "@component/Typography";
import TextField from "@component/text-field";
import StyledSearchBox from "./styled";
import axios from "axios";
import apiList from "@utils/__api__/apiList";
 
export default function CustomSearch( {loader,type,transactionType, token, setLoader,referalPoinst,setDatas,query,setQuery }: any) {
 console.log(type);
 console.log(transactionType);
  const [page,setPageNo]=useState(1);


    //call api for storing data into database through api
    const handleSearch = async (value:string) => {
      try {
   
          const response = await axios({
            url: `${apiList.SEARCH_MUTLI_POINT}?page=${page}&source=${type}&type=${transactionType}&q=${value}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });
        

          setDatas(response.data.data.transaction);
          return response;
    
        
      } catch (error) {
        console.log('Error in handleAddToCart:', error);
        throw error; // Re-throw to handle it in the calling function
      }
    }
    

  const search = debounce((e) => {
    const value = e.target?.value;

    if (!value){
        setDatas([]);
    } 
    else {
      handleSearch(value);
    }
  }, 200);

  const hanldeSearch = useCallback((event: any) => {
    setQuery(event.target.value);
    event.persist();
  
    search(event);
  }, []);


 
 
  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>

        <TextField
          fullwidth
          onChange={hanldeSearch}
          className="search-field"
          placeholder="Search..."
          value={query}
      
        />

       
      </StyledSearchBox>

      
    </Box>
  );
}

 
