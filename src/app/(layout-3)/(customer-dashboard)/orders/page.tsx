"use client"
import { Fragment, useEffect, useState } from "react";
// API FUNCTIONS
import useAxios from "custom/useAxios";
import apiList from "@utils/__api__/apiList";
// GLOBAL CUSTOM COMPONENTS
import Hidden from "@component/hidden";
import TableRow from "@component/TableRow";
import { H5 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
// PAGE SECTION COMPONENTS
import { OrderRow, OrdersPagination } from "@sections/customer-dashboard/orders";
import { tokens } from "@utils/utils";

export default function OrderList() {
  const [page, setPage] = useState(1);
  const { response: orderResponse, error: orderError, loading: orderLoading, fetchData: orderGetData } = useAxios();
  const token = tokens();
  const handleFetchData = async () => {
    try {
      // Call API for orders
      await orderGetData({
        url: apiList.ORDERS + `=${page}`, method: "GET", data: {}, params: null, headers: {
          Authorization: 'Bearer ' + token,
        }
      });
    } catch (error) {
      console.log("Error fetching  data:", error);
    }
  };

  useEffect(() => {
    handleFetchData(); // This will run every time when index has changed.

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // setPage(page+1);
        handleFetchData();// This will run when the scroll reach the bottom.
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);


  return (
    <Fragment>
      <DashboardPageHeader title="My Orders" iconName="bag_filled" />

      <Hidden down={769}>
        <TableRow boxShadow="none" padding="0px 18px" backgroundColor="transparent">
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Order #
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Status
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Date purchased
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Quantity
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Total
          </H5>

          <H5 flex="0 0 0 !important" color="text.muted" my="0px">View</H5>
        </TableRow>
      </Hidden>

      {orderResponse && orderResponse.data.map((item) => (
        <OrderRow order={item} key={item.id} />
      ))}

      {/* <OrdersPagination orderList={orderResponse && orderResponse.data} /> */}
    </Fragment>
  );
}
