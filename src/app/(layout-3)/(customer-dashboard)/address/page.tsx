"use client"
import { Fragment, Suspense } from "react";
// API FUNCTIONS
// GLOBAL CUSTOM COMPONENTS
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
// PAGE SECTION COMPONENTS
import {
  AddressItem,
  AddNewAddress,
  AddressPagination
} from "@sections/customer-dashboard/address";
import { useEffect, useState } from "react";
import useAxios from "custom/useAxios";
import { tokens } from "@utils/utils";
import apiList from "@utils/__api__/apiList";
export default  function AddressList() {
 const token=tokens();
  const { response: addressResponse, error: addresError, loading: addressLoading, fetchData: addessGetData } = useAxios();
  const { response: deleteResponse, error: deAddressError, loading: delAddressLoading, fetchData: delAddessGetData } = useAxios();
  const deleteAddress= async(id)=>{
    try {
      // Call API for add address
      await delAddessGetData({
        url: apiList.ADDRESS+`/${id}`, method: "DELETE", data: {}, params: null, headers: {
          Authorization: 'Bearer ' + token,
        }
      });
    } catch (error) {
      console.log("Error fetching  data:", error);
    }
    }

  const handleFetchData = async () => {
    try {
    
      // Call API for add address
      await addessGetData({
        url: apiList.ADDRESS, method: "GET", data: {}, params: null, headers: {
          Authorization: 'Bearer ' + token,
        }
      });
    } catch (error) {
      console.log("Error fetching  data:", error);
    }
  };
  useEffect(()=>{
    handleFetchData();
  },[deleteResponse]);


  return (
    <Suspense fallback="<div>Loading...</div>">
    <Fragment>
      <DashboardPageHeader title="My Addresses" iconName="pin_filled" button={<AddNewAddress />} />

      {addressResponse && addressResponse.data.map((item) => (
        <AddressItem key={item.id} item={item} deleteAddress={deleteAddress}/>
      ))} 

      {/* /* <AddressPagination addressList={addressList} /> */}
    </Fragment>
    </Suspense>
  );
}
