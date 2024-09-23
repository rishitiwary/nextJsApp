import Link from "next/link";
import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@component/avatar";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography, { H5, Paragraph, Tiny } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { currency } from "@utils/utils";
import apiList from '@utils/__api__/apiList';
// STYLED COMPONENT
import { StyledMiniCart } from "./styles";
import Notification from "@component/Notification";

// ==============================================================
type MiniCartProps = { toggleSidenav?: () => void };
// ==============================================================

export default function MiniCart({ toggleSidenav = () => { } }: MiniCartProps) {
  const { state, dispatch } = useAppContext();
  const [storeCode, setStoreCode] = useState('');
  const [token, setToken] = useState('');

  const [notificatonData, setNotificationData] = useState({ 'status': false });
  // Fetch data from localStorage
  useEffect(() => {
    const locationResponse = localStorage.getItem('locationResponse');
    const userData = localStorage.getItem('userData');

    if (locationResponse !== null) {
      try {
        const parsedData = JSON.parse(locationResponse);
        if (parsedData && parsedData.storecode) {
          setStoreCode(parsedData.storecode);
        } else {
          console.error("Location response does not contain 'storecode'");
        }
      } catch (error) {
        // Handle parsing errors here
        console.error("Error parsing location response:", error);
      }
    }

    if (userData) {
      setToken(JSON.parse(userData).token);
    }
  }, []);



  const handleCartAmountChange = (quantity: number, product: any) => () => {

    //call api for storing data into database through api
    const handleAddToCart = async () => {
      const datas = {
        quantity: quantity,
        productId: product.id,
        productVariantId: product.productVariant
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

      if (product.maxQuantity >= quantity) {
        if (product.limit ? product.limit >= quantity : true) {
            dispatch({
              type: "CHANGE_CART_AMOUNT",
              payload: { ...product, qty: quantity }
            });
            const res = await handleAddToCart();
        } else {
          setNotificationData({ 'status': true, 'limit': product.limit });
        }
      }
    }

    addToCart();

  };

  const getTotalPrice = () => {
    return state.cart.reduce((accumulator, item) => accumulator + item.price * item.qty, 0) || 0;
  };


  return (
    <StyledMiniCart>
      <div className="cart-list">
        <Notification notificatonData={notificatonData} />
        <FlexBox alignItems="center" m="0px 20px" height="74px">
          <Icon size="1.75rem">bag</Icon>
          <Typography fontWeight={600} fontSize="16px" ml="0.5rem">
            {state.cart.length} item
          </Typography>
        </FlexBox>

        <Divider />

        {!!!state.cart.length && (
          <FlexBox
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            height="calc(100% - 80px)">
            <Image src="/assets/images/logos/shopping-bag.svg" width={90} height={90} alt="bonik" />
            <Paragraph mt="1rem" color="text.muted" textAlign="center" maxWidth="200px">
              Your shopping bag is empty. Start shopping
            </Paragraph>
          </FlexBox>
        )}

        {state.cart.map((item,index) => (
      
          < Fragment key = { index } >
           
            <div className="cart-item">
              <FlexBox alignItems="center" flexDirection="column">
                <Button
                  size="none"
                  padding="5px"
                  color="primary"
                  variant="outlined"
                  borderRadius="300px"
                  borderColor="primary.light"
                  onClick={handleCartAmountChange(item.qty + 1, item)}>
                  <Icon variant="small">plus</Icon>
                </Button>

                <Typography fontWeight={600} fontSize="15px" my="3px">
                  {item.qty}
                </Typography>

                <Button
                  size="none"
                  padding="5px"
                  color="primary"
                  variant="outlined"
                  borderRadius="300px"
                  borderColor="primary.light"
                  onClick={handleCartAmountChange(item.qty - 1, item)}

                >
                    <Icon variant="small">{item.qty===1?'delete':'minus'}</Icon>
                </Button>
              </FlexBox>

              <Link href={`/product/${item.slug}`}>
                <Avatar
                  size={76}
                  mx="1rem"
                  alt={item.name}
                  src={item.imgUrl || "/assets/images/products/iphone-x.png"}
                />
              </Link>

              <div className="product-details">
                <Link href={`/product/${item.id}`}>
                  <H5 className="title" fontSize="14px">
                    {item.brand} {item.name}

                  </H5>
                </Link>

                <Tiny color="text.muted">
                  {currency(item.price)} x {item.qty}
                </Tiny>

                <Typography fontWeight={600} fontSize="14px" color="primary.main" mt="4px">
                  {currency(item.qty * item.price)}
                &nbsp; {item.size?`(${item.size})`:''}
                </Typography>
              </div>

              {/* <Icon
                size="1rem"
                ml="1.25rem"
                className="clear-icon"
                onClick={handleCartAmountChange(0, item)}>
                close
              </Icon> */}
            </div>
            <Divider />
          </Fragment>
        ))}
    </div>

      {
    !!state.cart.length && (
      <div className="actions">
      
{token=='' || token==null?  <Link href="/login">
          <Button fullwidth color="primary" variant="contained" mt="1rem" borderRadius={10} onClick={toggleSidenav}>
            <Typography fontWeight={600}>View Cart ({currency(getTotalPrice())})</Typography>
          </Button>
        </Link>:  <Link href="/cart">
          <Button fullwidth color="primary" variant="contained" mt="1rem" borderRadius={10} onClick={toggleSidenav}>
            <Typography fontWeight={600}>View Cart ({currency(getTotalPrice())})</Typography>
          </Button>
        </Link>}
      
      </div>
    )
  }
    </StyledMiniCart >
  );
}
