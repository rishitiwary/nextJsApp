"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useCallback, useState, useEffect } from "react";
import styled from "styled-components";

import { useAppContext } from "@context/app-context";

import Box from "@component/Box";
import Rating from "@component/rating";
import { Chip } from "@component/Chip";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import NextImage from "@component/NextImage";
import Card, { CardProps } from "@component/Card";
import { H3, SemiSpan } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";
import apiList from '@utils/__api__/apiList';
import { calculateDiscount, currency, getTheme, tokens } from "@utils/utils";
import { deviceSize } from "@utils/constants";
import axios from "axios";


// STYLED COMPONENT
const Wrapper = styled(Card)`
  margin: auto;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  transition: all 250ms ease-in-out;

  &:hover {
    .details {
      .add-cart {
        display: flex;
      }
    }
    .image-holder {
      .extra-icons {
        display: block;
      }
    }
  }

  .image-holder {
    text-align: center;
    position: relative;
    display: inline-block;
    height: 100%;

    .extra-icons {
      z-index: 2;
      top: 0.75rem;
      display: none;
      right: 0.75rem;
      cursor: pointer;
      position: absolute;
    }

    @media only screen and (max-width: ${deviceSize.sm}px) {
      display: block;
    }
  }

  .details {
    padding: 1rem;

    .title,
    .categories {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .icon-holder {
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      justify-content: space-between;
    }

    .favorite-icon {
      cursor: pointer;
    }
    .outlined-icon {
      svg path {
        fill: ${getTheme("colors.text.hint")};
      }
    }
    .add-cart {
      display: none;
      margin-top: auto;
      align-items: center;
      flex-direction: column;
    }
  }

  @media only screen and (max-width: 768px) {
    .details {
      .add-cart {
        display: flex;
      }
    }
  }
`;

// =======================================================================
interface ProductCard1Props extends CardProps {
  vid?: number;
  off?: any;
  slug: string;
  title: string;
  mrp: number;
  imgUrl: string;
  value: number;
  unit: string;
  images: string[];
  id?: string | number;
  maxQuantity?: number;
  offPrice?: number;
  productVariant?: number;
  token?: any;
  storeCode?: any;
  limit?: any;
  setNotificationData?: any;
  setSelectedVariantId?: any;
  brand?: string;

}
// =======================================================================

export default function ProductVariantCard({
  vid,
  id,
  off,
  slug,
  title,
  mrp,
  imgUrl,
  images,
  value,
  unit,
  maxQuantity,
  offPrice,
  productVariant,
  token,
  storeCode,
  limit,
  setNotificationData,
  setSelectedVariantId,
  brand,
  ...props
}: ProductCard1Props) {

  const [open, setOpen] = useState(false);
  const { state, dispatch } = useAppContext();
  const cartItem = state.cart.find((item) => {
    return item.productVariant === productVariant;
  });

  const toggleDialog = useCallback(() => setOpen((open) => !open), []);
  const handleCartAmountChange = (quantity: number, maxQuantity: number, id: string | number, productVariant: number, limit: number, value: any, unit: any, brand: string) => () => {
    const size: string = value + ' ' + unit;


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

      if (maxQuantity >= quantity) {
        if (limit ? limit >= quantity : true) {
         
          dispatch({
            type: "CHANGE_CART_AMOUNT",
            payload: {
              id: id as number | string,
              slug,
              price: offPrice,
              brand,
              imgUrl,
              name: title,
              qty: quantity,
              productVariant: productVariant,
              maxQuantity: maxQuantity,
              limit: limit,
              size: size,
              mrp: mrp,

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
    <>
      <Wrapper borderRadius={8} {...props}>
        <div className="image-holder">
          {!!off && (
            <Chip
              top="10px"
              left="10px"
              p="5px 10px"
              fontSize="10px"
              fontWeight="600"
              bg="primary.main"
              position="absolute"
              color="primary.text"
              zIndex={1}>
              {off}% off
            </Chip>
          )}


          <Link href="#" onClick={() => setSelectedVariantId(vid)}>
            <Image alt={title} width={277} src={imgUrl} height={250} />
          </Link>
        </div>

        <div className="details">
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr="0.5rem">
              <Link href="#">
                <H3
                  mb="10px"
                  title={title}
                  fontSize="14px"
                  textAlign="left"
                  fontWeight="600"
                  className="title"
                  color="text.secondary">
                  {title}
                </H3>
              </Link>

              {value} {unit}
              <FlexBox alignItems="center" mt="10px">
                <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                  {currency(offPrice)}

                </SemiSpan>

                {!!off && (
                  <SemiSpan color="text.muted" fontWeight="600">
                    <del>{currency(mrp)}</del>
                  </SemiSpan>
                )}
              </FlexBox>
            </Box>
            {maxQuantity > 0 ?
              <FlexBox
                width="80px"
                alignItems="flex-end"
                flexDirection="row-reverse"
                justifyContent={!!cartItem?.qty ? "space-between" : "flex-start"}>
                {cartItem?.qty >= maxQuantity ? <Button
                  size="none"
                  padding="3px"
                  color="primary"
                  variant="outlined"
                  borderColor="primary.light"
                  disabled
                >
                  <Icon variant="small">plus</Icon>
                </Button> : <Button
                  size="none"
                  padding="3px"
                  color="primary"
                  variant="outlined"
                  borderColor="primary.light"
                  onClick={handleCartAmountChange(((cartItem?.qty || 0) + 1), maxQuantity, id, productVariant, limit, value, unit)}>
                  <Icon variant="small">plus</Icon>
                </Button>}

                {!!cartItem?.qty && (
                  <Fragment>
                    <SemiSpan color="text.primary" fontWeight="600" padding={1}>
                      {cartItem.qty}
                    </SemiSpan>

                    <Button
                      size="none"
                      padding="3px"
                      color="primary"
                      variant="outlined"
                      borderColor="primary.light"
                      onClick={handleCartAmountChange(((cartItem?.qty || 0) - 1), maxQuantity, id, productVariant, limit, value, unit)}>
                      <Icon variant="small">{cartItem.qty===1?'delete':'minus'}</Icon>
                    </Button>
                  </Fragment>
                )}
              </FlexBox>
              : <FlexBox
                width="100px"
                alignItems="center"
                flexDirection="column-reverse"
                justifyContent={!!cartItem?.qty ? "space-between" : "flex-start"}>

                <Button
                  size="none"
                  padding="3px"
                  color="primary.danger"
                  variant="contained"
                  borderColor="primary.light"
                  borderRadius={10}
                  width={110}
                >
                  Out of stock
                </Button>
              </FlexBox>
            }
          </FlexBox>
        </div>
      </Wrapper>

      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={{ images, title, mrp, id: id as number | string, slug }}
      />
    </>
  );
}
