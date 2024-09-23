"use client";
import { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
// UTILS
import { currency } from "@utils/utils";
// API FUNCTIONS
import api from "@utils/__api__/orders";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Typography, { H5, H6, Paragraph } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
// PAGE SECTION COMPONENTS
import { OrderStatus, WriteReview, OrderListButton } from "@sections/customer-dashboard/orders";
// CUSTOM DATA MODEL
import { IDParams } from "interfaces";
import { tokens } from "@utils/utils";
import apiList from "@utils/__api__/apiList";
export default function OrderDetails({ params }: IDParams) {
  const token = tokens();
  const [trackResponse, setTrackResponse] = useState(null);
  const [loader, setLoader] = useState(false);
  const trackOrder = async () => {
    try {
      if (token) {
        const response = await axios({
          url: `${apiList.TRACK_ORDER}/${params.id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTrackResponse(response.data);
        return response;
      }
    } catch (error) {
      console.log('Error in handleAddToCart:', error);
      throw error; // Re-throw to handle it in the calling function
    }
  }
  useEffect(() => {
    trackOrder();
  }, []);
  const address=!!trackResponse && trackResponse.data.address;
  const items=!!trackResponse && trackResponse.data.items;
  const deliveryCharge=!!trackResponse && trackResponse.data.deliveryCharge;

  const totalPrice = !!items && items.reduce((acc, item) => {
    return acc + (item.mrp - item.off) * item.quantity;
  }, deliveryCharge);
  return (
    <Fragment>
      <DashboardPageHeader
        title="Order Details"
        iconName="bag_filled"
        button={<OrderListButton />}
      />

      <OrderStatus response={trackResponse} />
      {!!trackResponse && trackResponse.data ?
        <>

          <Card p="0px" mb="30px" overflow="hidden" borderRadius={8}>
            <TableRow bg="gray.200" p="12px" boxShadow="none" borderRadius={0}>
              <FlexBox className="pre" m="6px" alignItems="center">
                <Typography fontSize="14px" color="text.muted" mr="4px">
                  Order ID:
                </Typography>

                <Typography fontSize="14px">#{trackResponse.data.id}</Typography>
              </FlexBox>

              <FlexBox className="pre" m="6px" alignItems="center">
                <Typography fontSize="14px" color="text.muted" mr="4px">
                  Placed on: {trackResponse.data.dateTime}
                </Typography>

                <Typography fontSize="14px">
                  {trackResponse.dateTime}
                </Typography>
              </FlexBox>

              {trackResponse.isDelivered && (
                <FlexBox className="pre" m="6px" alignItems="center">
                  <Typography fontSize="14px" color="text.muted" mr="4px">
                    Delivered on:
                  </Typography>

                  <Typography fontSize="14px">
                    {format(new Date(trackResponse.deliveredAt), "dd MMM, yyyy")}
                  </Typography>
                </FlexBox>
              )}
            </TableRow>

            <Box py="0.5rem">
          {items.map((item, ind) => (
            <WriteReview item={item} />
          ))}
        </Box>
          </Card>

          <Grid container spacing={6}>
            <Grid item lg={6} md={6} xs={12}>
              <Card p="20px 30px" borderRadius={8}>
                <H5 mt="0px" mb="14px">
                  Shipping Address
                </H5>

                <Paragraph fontSize="14px" my="0px">
                Name - {trackResponse.data.name} , Contact - {trackResponse.data.phone}
                <br/>
              Address -    {address.locality} {address.address} , Pin - {address.pinCode} ,

                 District - {address.district}
                </Paragraph>
              </Card>
            </Grid>

            <Grid item lg={6} md={6} xs={12}>
              <Card p="20px 30px" borderRadius={8}>
                <H5 mt="0px" mb="14px">
                  Total Summary
                </H5>

                <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
                  <Typography fontSize="14px" color="text.hint">
                    Subtotal:
                  </Typography>

                  <H6 my="0px">{currency(totalPrice-deliveryCharge)}</H6>
                </FlexBox>

                <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
                  <Typography fontSize="14px" color="text.hint">
                    Delivery Charge:
                  </Typography>

                  <H6 my="0px">{currency(deliveryCharge)}</H6>
                </FlexBox>

                <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
                  <Typography fontSize="14px" color="text.hint">
                    Promo Discount:
                  </Typography>

                  <H6 my="0px">-{currency(trackResponse.data.promoDiscount)}</H6>
                </FlexBox>

                <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
                  <Typography fontSize="14px" color="text.hint">
                  Loyalty Point:
                  </Typography>

                  <H6 my="0px">-{currency(trackResponse.data.loyaltyPoint)}</H6>
                </FlexBox>
                <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
                  <Typography fontSize="14px" color="text.hint">
                  Grozep Point:
                  </Typography>

                  <H6 my="0px">-{currency(trackResponse.data.point)}</H6>
                </FlexBox>
                <Divider mb="0.5rem" />

                <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
                  <H6 my="0px">Total</H6>
                  <H6 my="0px">{currency(totalPrice-trackResponse.data.point-trackResponse.data.loyaltyPoint-trackResponse.data.promoDiscount)}</H6>
                </FlexBox>

                <Typography fontSize="14px">Paid by postpaid</Typography>
              </Card>
            </Grid>
          </Grid>
        </>
        : null}

    </Fragment>
  );
}
