import { useCallback, useEffect, useState,Suspense } from "react";
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
import { useSearchParams } from "next/navigation";
export default function SearchInputWithCategory() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(initialQuery);
  const [resultList, setResultList] = useState<string[]>([]);
  const locationResponse = localStorage.getItem('locationResponse');
 
  const storeCode:string = !!locationResponse && JSON.parse(locationResponse).storecode;
  const [page,setPageNo]=useState(1);


    //call api for storing data into database through api
    const handleSearch = async (value:string) => {
      try {
        if (storeCode) {
          const response = await axios({
            url: `${apiList.GLOBAL_SEARCH}?q=${value}&page=${page}`,
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
    

  const search = debounce((e) => {
    const value = e.target?.value;

    if (!value){
      setResultList([]);
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

  const handleDocumentClick = () => setResultList([]);

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  const selectOption = (item: string) => {
    setQuery(item); // Set the selected option to the query state
    setResultList([]); // Clear the results list after selection
  };

 
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>

        <TextField
          fullwidth
          onChange={hanldeSearch}
          className="search-field"
          placeholder="Search and hit enter..."
          value={query}
      
        />

        {/* <Menu
          direction="right"
          className="category-dropdown"
          handler={
            <FlexBox className="dropdown-handler" alignItems="center">
              <span>{category}</span>
              <Icon variant="small">chevron-down</Icon>
            </FlexBox>
          }>
          {categories.map((item) => (
            <MenuItem key={item} onClick={handleCategoryChange(item)}>
              {item}
            </MenuItem>
          ))}
        </Menu> */}
      </StyledSearchBox>

      {!!resultList.length && (
        <Card position="absolute" top="100%" py="0.5rem" width="100%" boxShadow="large" zIndex={99}>
          {resultList.map((item,index) => (
            <Link href={`/product/search?query=${item.name?.toLowerCase()}`} key={index}>
              <MenuItem key={index}>
                <Span fontSize="14px" onClick={() => selectOption(item.name)}>{item.name}</Span>
              </MenuItem>
            </Link>
          ))}
        </Card>
      )}
    </Box>
    </Suspense>
  );
}


