"use client";

import styled from "styled-components";
import { space, SpaceProps } from "styled-system";
import FlexBox from "@component/FlexBox";
import LazyImage from "@component/LazyImage";
import Typography from "@component/Typography";

import { currency, getTheme, isValidProp } from "@utils/utils";
import { Fragment } from "react";

// STYLED COMPONENTS
const Wrapper = styled.div.withConfig({
    shouldForwardProp: (prop) => isValidProp(prop)
})`
  display: flex;
  overflow: hidden;
  position: relative;
  border-bottom-left-radius: 10px;
border-bottom-right-radius: 10px;
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
interface GoodiesProps extends SpaceProps {
    qty: number;
    name: string;

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
    currentPrice?: any;
    expDate?: any;
    minAmount?: any;
}
// =====================================================================

export default function OfferProduct(props: GoodiesProps) {
    const { id, name, qty, price, imgUrl, maxQuantity, productVariant, token, storeCode, size, currentPrice, expDate, minAmount, ...others } = props;
    return (
        <Fragment >
            <FlexBox width="100%"
                minWidth="0px"
                padding={10}
                backgroundColor="green"
                color="white"
                justifyContent="space-between">
                <Typography>Shop for {currency(minAmount)} to get free product</Typography>

                <Typography fontWeight={600}>Limited period offers</Typography>
            </FlexBox>
            <Wrapper {...others} >

                <LazyImage
                    alt={name}
                    width={110}
                    height={110}
                    src={imgUrl || "/logo.png"}

                />
                <FlexBox
                    width="100%"
                    minWidth="0px"
                    flexDirection="column"
                    className="product-details"
                    justifyContent="space-between">
                    <Typography className="title" fontWeight="600" fontSize="18px" mb="0.5rem">
                        {name}

                    </Typography>


                    <Typography className="title" fontWeight="600" fontSize="15px" mb="0.5rem"> {size}  Expiry : {expDate}</Typography>
                    <FlexBox justifyContent="space-between" alignItems="flex-end">
                        <FlexBox flexWrap="wrap" alignItems="center">
                            <Typography color="gray.600" mr="0.5rem">
                                {currency(price)} x {qty}

                            </Typography>

                            <Typography color="gray.600" mr="0.5rem" fontWeight={600} >
                                Get Limit period offer
                            </Typography>
                        </FlexBox>

                        <Fragment>
                            <FlexBox alignItems="center">
                                <Typography mx="0.5rem" fontWeight="600" fontSize="15px">
                                    {currency(price * qty)}
                                    &nbsp;  <del>{currency(currentPrice * qty)}</del>
                                </Typography>
                            </FlexBox>
                        </Fragment>

                    </FlexBox>
                </FlexBox>

            </Wrapper >

        </Fragment>
    );
}
