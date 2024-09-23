"use client"
import Box from "@component/Box";

import { useEffect, Fragment } from "react";
import apiList from "@utils/__api__/apiList";
import useAxios from "custom/useAxios";
import Grid from "@component/grid/Grid";
import Typography from "@component/Typography";
import Container from "@component/Container";
// ==============================================================
interface Props {
  params: { slug: string };
  page: { pageNo: string };
}
// ==============================================================

export default function Pages({ params }: Props) {


  const { response: pageResponse, error: pageError, loading: pageLoading, fetchData: FetchData } = useAxios();


  const fetchData = async () => {
    try {


      await FetchData({ url: apiList.DYNAMIC_PAGES + params.slug, method: "GET", data: {}, params: null });

    } catch (error) {
      console.log("Error fetching inventory data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);




  return (
    <Fragment>
       <Container my="1.5rem" height="100vh">
       <Grid container spacing={6}>
      {!!pageResponse && pageResponse.data ?
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <Typography fontWeight="bold" fontSize="30px">

        {pageResponse.data.title.toUpperCase()}
          </Typography>

          <Typography fontWeight="normal" fontSize="20px">

{pageResponse.data.description}
  </Typography>
        </Grid>
      : null}

</Grid>
</Container>
    </Fragment>
  );
}


