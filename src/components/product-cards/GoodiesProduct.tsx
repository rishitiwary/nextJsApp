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
}
// =====================================================================

export default function GoodiesProduct(props: GoodiesProps) {
    const { id, name, qty, price, imgUrl, maxQuantity, productVariant, token, storeCode, size, ...others } = props;
    return (
        <Fragment >
            <Wrapper {...others} style={{backgroundColor:'#FBFFDC'}}>
                <LazyImage
                    alt={name}
                    width={100}
                    height={100}
                    margin={2}
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
                    {size}

                    <FlexBox justifyContent="space-between" alignItems="flex-end">
                        <FlexBox flexWrap="wrap" alignItems="center">
                            <Typography color="gray.600" mr="0.5rem">
                                {currency(price)} x {qty}
                            </Typography>

                            
                        </FlexBox>

                        <Fragment>
                            <FlexBox alignItems="center">
                                <Typography mx="0.5rem" fontWeight="600" fontSize="15px">
                                {currency(price * qty)}
                                </Typography>
                            </FlexBox>
                        </Fragment>

                    </FlexBox>
                </FlexBox>
            </Wrapper >

        </Fragment>
    );
}
