"use client";

import { tokens } from "@utils/utils";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { useAppContext } from "@context/app-context";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import axios from "axios";
import apiList from "@utils/__api__/apiList";
import Link from "next/link";

export default function Layout({ children }: PropsWithChildren) {
  const { dispatch,state } = useAppContext();
  const token = tokens();
  const [response, setResponse] = useState();
  const ClearCart = async () => {
    try {
      const result = await axios({
        url: apiList.SHOPING_BAG,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // Return the response object
      setResponse(result.data);
      return result;

    } catch (error) {
      console.log('Error in handleAddToCart:', error);
      throw error; // Re-throw to handle it in the calling function
    }
  }

  useEffect(() => {
    if (response && response.status) {
      console.log("response for clear cart");
      localStorage.removeItem('cart');
      window.location.replace('/');
    
    }

  }, [response]);
 

  return (
    <Fragment>
      <Box mb="14px">
        <Grid container spacing={6}>
          <Grid item lg={7} md={7} xs={12}>
            <h2>Shopping Bag</h2>
          </Grid>
      
         <Grid item lg={2} md={2} xs={12}>
            <Link href="#">
            <span onClick={ClearCart}>Clear All</span>
            </Link>
          </Grid>
         
        </Grid>
      </Box>

      {children}
    </Fragment>
  );
}
