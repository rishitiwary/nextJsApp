"use client";
import axios from "axios";
import React, { useState, useEffect, useMemo,Suspense } from "react";
import apiList from "@utils/__api__/apiList";
import Section1 from "@sections/home/Section1";
import Section2 from "@sections/home/Section2";
import Section3 from "@sections/home/Section3";
import Section11 from "@sections/home/Section11";
import Layout1 from "@component/layout/layout-1";
import { defaults } from "config/default";
import Spinner from "@component/Spinner";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";

export default function Home() {

  const [moreItems, setMoreItems] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [homeMenus, setHomeMenu] = useState(null);
  const [loader, setLoader] = useState(true);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [storeCode, setStoreCode] = useState('');

 
  useEffect(() => {
    const locationResponse = localStorage.getItem('locationResponse');
    const userData = localStorage.getItem('userData');
    const metaData = localStorage.getItem('metaData');
    if (locationResponse !== null) {
      try {
        const parsedData = JSON.parse(locationResponse);
        if (parsedData && parsedData.storecode) {
          setStoreCode(parsedData.storecode);
          setDeliveryTime(parsedData.regularDurationMin);
        } else {
          console.error("Location response does not contain 'storecode'");
        }
      } catch (error) {
        // Handle parsing errors here
        console.error("Error parsing location response:", error);
      }
    }else{
      setStoreCode(defaults.storecode);
    }


    const fetchData = async () => {
  
      try {
        setLoader(true);
        if (storeCode) {
          const [moreItemsResponse, homeDataResponse, homeMenusResponse] = await Promise.all([
            axios.get(apiList.HOME_MORE_FOR_YOU, { headers: { storecode: storeCode } }),
            axios.get(apiList.HOME, { headers: { storecode: storeCode } }),
            axios.get(apiList.HOME_MENU, { headers: { storecode: storeCode } }),
          ]);

          setMoreItems(moreItemsResponse.data);
          setHomeData(homeDataResponse.data);
          setHomeMenu(homeMenusResponse.data);
          setLoader(false);
        }
      } catch (error) {
       
        setLoader(false);

        console.error("Error fetching home data:", error);
      }
    };

    fetchData();
   
  }, [storeCode]);

  // Memoizing the derived data to prevent unnecessary re-calculations
  const metaData = useMemo(() => homeData?.data?.metadata || null, [homeData]);
  const carousal = useMemo(() => homeData?.data?.carousal || null, [homeData]);
  const catalogs = useMemo(() => homeData?.data?.catalogs || null, [homeData]);
  const newest = useMemo(() => homeData?.data?.newest || null, [homeData]);
  const bestSeller = useMemo(() => homeData?.data?.bestSeller || null, [homeData]);
  const dailyEssential = useMemo(() => homeData?.data?.dailyEssential || null, [homeData]);

  return (
    <main>
      <Layout1>
        {loader?<Grid item xs={12} lg={12} md={12}>
        <FlexBox justifyContent="center">
        <Spinner/>
        </FlexBox>

      </Grid>:null}
    
        {/* HERO CAROUSEL AREA */}
        <Section1 carouselData={carousal} menuItems={homeMenus} metaData={metaData} />

        {/* TOP CATEGORIES AREA */}
        <Section3 categories={catalogs} />

        {/* BEST SELLER PRODUCTS AREA */}
        <Section2 productsData={bestSeller} />

        {/* NEW ARRIVALS AREA */}
        <Section2 productsData={newest} />

        {/* DAILY ESSENTIALS */}
        <Section2 productsData={dailyEssential} />

        {/* MORE PRODUCTS AREA */}
        <Section11 moreItems={moreItems} />
      </Layout1>
    </main>
  );
}
