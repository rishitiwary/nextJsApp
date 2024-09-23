"use client";

import Link from "next/link";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";
import axios from "axios";
import apiList from "@utils/__api__/apiList";
import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import LazyImage from "@component/LazyImage";
import Typography from "@component/Typography";
import { IconButton } from "@component/buttons";

import { currency, getTheme, isValidProp } from "@utils/utils";
import { useAppContext } from "@context/app-context";
import { Fragment } from "react";

// STYLED COMPONENTS
const Wrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => isValidProp(prop)
})`
  display: flex;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  box-shadow: ${getTheme("shadows.4")};
  background-color: ${getTheme("colors.body.paper")};

  .product-details {
    padding: 20px;
  }
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media only screen and (max-width: 425px) {
    flex-wrap: wrap;
    img {
      height: auto;
      min-width: 100%;
    }
  }
  ${space}
`;

// =====================================================================
interface ProductCard7Props extends SpaceProps {
  qty: number;
  name: string;
  slug: string;
  price: number;
  imgUrl?: string;
  id: string | number;
  token?: any;
  storeCode?: any;
  maxQuantity?: number;
  productVariant?: any;
  limit?: any;
  setNotificationData?: any;
  size?: any;
  mrp?: any;
  brand?: any;
  setPromoDiscount?: any;
  setGrozepPoints?: any;
  setBuy4earnPoints?: any;
  setAppliedCoupons?: any;
}
// =====================================================================

export default function ProductCard7(props: ProductCard7Props) {
  const { id, name, qty, price, imgUrl, slug, maxQuantity, productVariant, token, storeCode, limit, size, setNotificationData, mrp, brand, setPromoDiscount, setGrozepPoints, setBuy4earnPoints, setAppliedCoupons, ...others } = props;

  const { dispatch, state } = useAppContext();
  const cartItem = state.cart.find((item) => item.id === id);
  const handleCartAmountChange = (quantity: number) => () => {

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
      if (maxQuantity >= quantity) {
        if (limit ? limit >= quantity : true) {
          setBuy4earnPoints(0)
          setGrozepPoints(0)
          setPromoDiscount(0)
          setAppliedCoupons([])
          dispatch({
            type: "CHANGE_CART_AMOUNT",
            payload: {
              id: id as number | string,
              slug,
              price,
              imgUrl,
              name,
              brand,
              qty: quantity,
              productVariant,
              maxQuantity,
              limit,
              size,
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
    <Fragment>
      {!!cartItem?.qty && (
        <Wrapper {...others}>
          <Link href={`/product/${slug}`}>
            <LazyImage
              alt={name}
              width={110}
              height={110}
              src={imgUrl || "/logo.png"}
            />
          </Link>
          <FlexBox
            width="100%"
            minWidth="0px"
            flexDirection="column"
            className="product-details"
            justifyContent="space-between">
            <Link href={`/product/${slug}`}>
              <Typography className="title" fontWeight="600" fontSize="18px" mb="0.5rem">
                {brand}  {name}
              </Typography>
              {size}
            </Link>

            {/* <Box position="absolute" right="1rem" top="1rem">
          <IconButton padding="4px" ml="12px" onClick={handleCartAmountChange(0)}>
            <Icon size="1.25rem">close</Icon>
          </IconButton>
        </Box> */}

            <FlexBox justifyContent="space-between" alignItems="flex-end">
              <FlexBox flexWrap="wrap" alignItems="center">
                <Typography color="gray.600" mr="0.5rem">
                  <del>{currency(mrp)}</del> &nbsp; {currency(price)} x {cartItem.qty}

                </Typography>

                <Typography fontWeight={600} color="primary.main" mr="1rem">
                  {currency(price * cartItem.qty)}
                </Typography>
              </FlexBox>

              <Fragment>
                <FlexBox alignItems="center">
                  <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderColor="primary.light"
                    onClick={handleCartAmountChange((cartItem?.qty || 0) - 1)}>
                    <Icon variant="small">{cartItem.qty === 1 ? 'delete' : 'minus'}</Icon>
                  </Button>
                  <Typography mx="0.5rem" fontWeight="600" fontSize="15px">
                    {cartItem.qty}
                  </Typography>
                  {cartItem.qty >= cartItem.maxQuantity ? <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderColor="primary.light"
                    disabled
                  >
                    <Icon variant="small">plus</Icon>
                  </Button> : <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderColor="primary.light"
                    onClick={handleCartAmountChange((cartItem?.qty || 0) + 1)}>
                    <Icon variant="small">plus</Icon>
                  </Button>}

                </FlexBox>
              </Fragment>

            </FlexBox>
          </FlexBox>
        </Wrapper >
      )}
    </Fragment>
  );
}
