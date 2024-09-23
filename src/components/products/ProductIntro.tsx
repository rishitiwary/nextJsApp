"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import Box from "@component/Box";
import Image from "@component/Image";
import Rating from "@component/rating";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { H1, H2, H3, H6, SemiSpan } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { currency, calculateDiscount } from "@utils/utils";
import apiList from "@utils/__api__/apiList";
import axios from "axios";
// ========================================
type ProductIntroProps = {
  brand?: string;
  off?: any;
  slug: string;
  title: string;
  mrp: number;
  imgUrl: string;
  value: number;
  unit: string;
  images: string[];
  id?: string | number;
  totalQuantity?: number;
  offPrice?: number;
  productVariant?: number;
  token?: any;
  storeCode?: any;
  limit?: any;
  setNotificationData?: any;
  description?: any;
};
// ========================================

export default function ProductIntro({ id,
  off,
  slug,
  title,
  mrp,
  imgUrl,
  images,
  value,
  unit,
  totalQuantity,
  offPrice,
  productVariant,
  token,
  storeCode,
  brand,
  limit,
  setNotificationData,
  description,
  ...props }: ProductIntroProps) {


  const param = useParams();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const routerId = param.slug as string;
  const cartItem = state.cart.find((item) => item.productVariant === productVariant || item.id === routerId);

  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  const handleCartAmountChange = (quantity: number, totalQuantity: number) => () => {

    //call api for storing data into database through api
    const handleAddToCart = async () => {
      const datas = {
        quantity: quantity,
        productId: id,
        productVariantId: productVariant
      };

      try {
        if (token && storeCode) {
          const response = await axios({
            url: apiList.SHOPING_BAG,
            method: 'POST',
            data: datas,
            headers: {
              Authorization: `Bearer ${token}`,
              storecode: storeCode
            }
          });
          // Return the response object
          return response;
        }
      } catch (error) {
        console.log('Error in handleAddToCart:', error);
        throw error; // Re-throw to handle it in the calling function
      }
    };


    const addToCart = async () => {
      const size: string = value + ' ' + unit;
      if (totalQuantity >= quantity) {
        if (limit ? limit >= quantity : true) {
          dispatch({
            type: "CHANGE_CART_AMOUNT",
            payload: {
              id: id as number | string,
              slug,
              price: offPrice,
              imgUrl,
              brand,
              name: title,
              qty: quantity,
              productVariant: productVariant,
              maxQuantity: totalQuantity,
              limit: limit,
              size: size,
              mrp,
            }
          });
          const res = await handleAddToCart();
        } else {
          setNotificationData({ 'status': true, 'limit': limit });
        }
      }
    }

    addToCart();

  };

  return (
    <Box overflow="hidden">
      <Grid container justifyContent="center" spacing={16}>

        <Grid item md={6} xs={12} alignItems="center">
          <div>
            <FlexBox mb="50px" overflow="hidden" borderRadius={16} justifyContent="center">
              <Image
                src={images}
                alt={title}
                width={300}
                height={300}

                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </FlexBox>

            {/* <FlexBox overflow="auto">
              {images.map((url, ind) => (
                <Box
                  key={ind}
                  size={70}
                  bg="white"
                  minWidth={70}
                  display="flex"
                  cursor="pointer"
                  border="1px solid"
                  borderRadius="10px"
                  alignItems="center"
                  justifyContent="center"
                  ml={ind === 0 ? "auto" : ""}
                  mr={ind === images.length - 1 ? "auto" : "10px"}
                  borderColor={selectedImage === ind ? "primary.main" : "gray.400"}
                  onClick={handleImageClick(ind)}>
                  <Avatar src={url} borderRadius="10px" size={65} />
                </Box>
              ))}
            </FlexBox> */}
          </div>
        </Grid>

        <Grid item md={6} xs={12} alignItems="center">
          <H1 mb="1rem">{brand.toLocaleUpperCase()}{title.toLocaleUpperCase()}  {!!off && (<SemiSpan color="primary.main" style={{ fontSize: 30 }}>{off}% off</SemiSpan>)} </H1>

          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Brand:</SemiSpan>
            <H6 ml="8px">{brand} </H6>
          </FlexBox>

          {/* <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Rated:</SemiSpan>
            <Box ml="8px" mr="8px">
              <Rating color="warn" value={4} outof={5} />
            </Box>
            <H6>(50)</H6>
          </FlexBox> */}

          <Box mb="24px">


            <FlexBox alignItems="center" mt="10px">
              Price :
              <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                {calculateDiscount(mrp, off as number)}
              </SemiSpan>

              {!!off && (
                <SemiSpan color="text.muted" fontWeight="600">
                  <del>{currency(mrp)}</del>


                </SemiSpan>

              )}
              &nbsp; {value} {unit}
            </FlexBox>

            <br />
            {totalQuantity === 0 ? (<SemiSpan color="primary.main">Stock Un Available</SemiSpan>) : <SemiSpan color="inherit">Stock Available :  <SemiSpan color="primary.main" style={{ fontWeight: 'bold' }}>{totalQuantity}</SemiSpan></SemiSpan>}

          </Box>
          {totalQuantity > 0 ?
            <>


              {!cartItem?.qty ? (
                <Button
                  mb="36px"
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={handleCartAmountChange(1, totalQuantity)}>
                  Add to Cart
                </Button>
              ) : (
                <FlexBox alignItems="center" mb="36px">
                  <Button
                    p="9px"
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={handleCartAmountChange((cartItem?.qty - 1), totalQuantity)}>
                    <Icon variant="small">{cartItem.qty === 1 ? 'delete' : 'minus'}</Icon>
                  </Button>

                  <H3 fontWeight="600" mx="20px">
                    {cartItem?.qty.toString()}
                  </H3>
                  {cartItem?.qty >= totalQuantity ? <Button
                    p="9px"
                    size="small"
                    color="primary"
                    variant="outlined"
                    disabled
                  >
                    <Icon variant="small">plus</Icon>
                  </Button> : <Button
                    p="9px"
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={handleCartAmountChange((cartItem?.qty + 1), totalQuantity)}>
                    <Icon variant="small">plus</Icon>
                  </Button>}

                </FlexBox>
              )}
            </>
            : <Button
              mb="36px"
              size="small"
              color="primary"
              variant="contained"
            >
              Out of stock
            </Button>}


          <FlexBox alignItems="center" mb="1rem">
            {description}
          </FlexBox>
        </Grid>
      </Grid>
    </Box>
  );
}
