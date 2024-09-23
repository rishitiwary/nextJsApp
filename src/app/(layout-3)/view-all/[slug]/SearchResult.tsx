"use client";

import { useCallback, useEffect, useState } from "react";

import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Icon from "@component/icon/Icon";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button, IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { H5, Paragraph } from "@component/Typography";

import ProductGridView from "@component/products/ProductCard1List";
import ProductFilterCard from "@component/products/ProductFilterCard";
import useWindowSize from "@hook/useWindowSize";
import Link from "next/link";
import { useRouter } from "next/navigation";
// ==============================================================
type Props = {
  sortOptions: { label: string; value: string }[];
  productData?:any;
  setNotificationData?: any;
  storeCode?: any;
  token?: any;
 

};
// ==============================================================

export default function SearchResult({ sortOptions, productData,  setNotificationData, token, storeCode }: Props) {

  const router = useRouter();
  const handleGoBack = () => router.back();
  const width = useWindowSize();
  const [view, setView] = useState<"grid" | "list">("grid");
  const isTablet = width < 1025;
  const toggleView = useCallback((v: any) => () => setView(v), []);

  return (
    <>


      <FlexBox
        as={Card}
        mb="55px"
        p="1.25rem"
        elevation={5}
        flexWrap="wrap"
        borderRadius={8}
        alignItems="center"
        justifyContent="space-between">

        {productData && productData.length === 0 ? <div>
          <FlexBox flexWrap="wrap">
            Not found any records

            <Button variant="outlined" color="primary" m="0.5rem" onClick={handleGoBack}>
              Go Back
            </Button>

          </FlexBox>
        </div> : <div> <H5>Searching for </H5>
          <Paragraph color="text.muted">{productData && productData.length} results found</Paragraph></div>}
 
      </FlexBox>

      <Grid container spacing={6}>
      
     

        <Grid item lg={12} xs={12}>

          <ProductGridView products={productData} type="search" setNotificationData={setNotificationData} token={token} storeCode={storeCode} />

        </Grid>
      </Grid>
    </>
  );
}
