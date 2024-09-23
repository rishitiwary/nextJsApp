"use client"
import { Fragment, useEffect, useState } from "react";
// API FUNCTIONS
import apiList from "@utils/__api__/apiList";
// GLOBAL CUSTOM COMPONENTS
import { Card1 } from "@component/Card1";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
// PAGE SECTION COMPONENTS
import { BackToAddress, AddressForm } from "@sections/customer-dashboard/address";
import { useParams } from "next/navigation";
import useAxios from "custom/useAxios";

const AddressDetails = () => {
  const params = useParams();
  const [address, setAddress] = useState([]);
  const { response: addressResponse, error: addressError, loading: addressLoading, fetchData: addressFetchData } = useAxios();
  //fetch address info
  const fetchData = async () => {
    try {

      // Call API for product by category
      await addressFetchData({ url: apiList.ADDRESS + `/${params.id}`, method: "GET", data: null, params: null, headers: null });

    } catch (error) {
      console.log("Error fetching inventory data:", error);
    }
  };
  useEffect(() => {
    console.log('yes');
  }, []);


  return (
    <Fragment>
      <DashboardPageHeader iconName="pin_filled" title="Edit Address" button={<BackToAddress />} />

      <Card1 borderRadius={8}>
        <AddressForm address={address} />
      </Card1>
    </Fragment>
  );
};

export default AddressDetails;
