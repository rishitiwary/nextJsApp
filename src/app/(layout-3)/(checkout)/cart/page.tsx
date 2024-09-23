"use client";

import { Fragment, useState, useEffect, useMemo, useCallback,Suspense } from "react";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Modal from 'react-bootstrap/Modal';
import Grid from "@component/grid/Grid";
import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography, { Small,Paragraph } from "@component/Typography";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductCard7 } from "@component/product-cards";
import Image from "next/image";
// CUSTOM HOOK
import { useAppContext } from "@context/app-context";
// CUSTOM DATA
// UTILS
import { currency } from "@utils/utils";
import Notification from "@component/Notification";
import apiList from "@utils/__api__/apiList";
import axios from "axios";
import GoodiesProduct from "@component/product-cards/GoodiesProduct";
import OfferProduct from "@component/product-cards/OfferProduct";
import CouponsComp from "./Coupons";
import ShowMessage from "@component/ShowMessage";
import Spinner from "@component/Spinner";
import { useRouter } from "next/navigation";
import ProtectedPage from "@component/ProtectedPage";
export default function Cart() {
const router=useRouter();
  const { state } = useAppContext();
  const [storeCode, setStoreCode] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [token, setToken] = useState('');
  const [notificatonData, setNotificationData] = useState({ 'status': false });
  const [messageData, setMessageData] = useState({ 'status': false });
  const [metaData, setMetaData] = useState();
  const [cartData, setCartData] = useState([]);
  const [goodies, setGoodies] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceSaving, setTotalPriceSaving] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [selectedGoodies, setSelectedGoodies] = useState('');

  const [offerProduct, setOfferProduct] = useState('');
  const [walletAmount, setWalletAmount] = useState(null);
  const [grozepPoints, setGrozepPoints] = useState(0);
  const [appliedGP, setApplyGP] = useState(0);
  const [appliedBP, setApplyBP] = useState(0);
  const [buy4EarnPoints, setBuy4earnPoints] = useState(0);

  const [promoDiscount, setPromoDiscount] = useState(0);
  const [filterCoupons, setFilterCoupons] = useState([]);
  const [activeCoupon, setActiveCoupon] = useState();
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [applicableCouponAmount, setApplicableCouponAmount] = useState(0);
  const [Coupons, setCoupons] = useState(null);
  const [ShowGp, setShowGp] = useState(false);
  const [ShowBp, setShowBp] = useState(false);
  const [show, setShow] = useState(false);
  const [gpMessage, setGpMessage] = useState(null);
  const [bpMessage, setBpMessage] = useState(null);
  const [placeOrderResponse, setPlaceOrderResponse] = useState(true);
  const [clearCartResponse, setClearCartResponse] = useState(true);
  const [loader, setLoader] = useState(false);
  const handleClose = () => setShow(false);

// if(token==null || token==''){
//     window.location.replace('/login');
// }

  const userInfo =  !!state.userInfo && JSON.parse(state.userInfo)?.data;
 
  const gp = !!userInfo && userInfo.user.point;
  const allowedPercent = !!Coupons && Coupons.allowedPercent;
  const defaultAddress = userInfo?.addresses?.find(address => address.isDefault === true) || null;
  let deliveryCharge = totalPrice > metaData?.minOrderAmount ? 0 : metaData?.deliveryCharge;
  if (defaultAddress) {
    defaultAddress.addressId = defaultAddress.id;
  } else {
    console.log("No default address found.");
    // Handle the case when no default address exists (if necessary)
  }
  if (selectedGoodies) {
    selectedGoodies.quantity = selectedGoodies.constraints.quantity;
  }

  const handleShow = () => {
    setShow(true);
  }

  const getTotalPrice: any = useCallback(() => {
    return state.cart ? state.cart.reduce((acc, item) => acc + item.price * item.qty, 0) : 0;
  }, [state.cart]);

  const getTotalSavingPrice: any = useCallback(() => {

    return state.cart ? state.cart.reduce((acc, item) => acc + item.mrp * item.qty, 0) : 0;
  }, [state.cart]);


  //fetch cart data

  useEffect(() => {
 
     
 
    const locationResponse = localStorage.getItem('locationResponse');
    const userData = localStorage.getItem('userData');
    const metaData = localStorage.getItem('metaData');
    if (locationResponse !== null) {
      try {
        const parsedData = JSON.parse(locationResponse);
        if (parsedData && parsedData.storecode) {
          setStoreCode(parsedData.storecode);
          setDeliveryTime(parsedData.regularDurationMin);
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
    if (metaData) {
      setMetaData(JSON.parse(metaData));
    }
    setAppliedCoupons([]);

  }, []);

  useEffect(() => {
    if (token && storeCode) {
      fetchCartData();
      fetchWalletAmount();
      fetchCoupons();

    }
  }, [token, storeCode]);

  // Function to calculate total quantity for a product
  const calculateTotalQuantity = useCallback((supplies: any) => {
    return supplies.reduce((total: any, supply: any) => total + supply.quantity, 0);
  }, []);

  //for goodies


  useEffect(() => {
    const validGoodies = goodies.filter((item, index) => {
      const { minAmount, maxAmount, quantity, price } = item.constraints;
      const SavingPrices: any = getTotalSavingPrice() + (price * quantity);
      if (getTotalPrice() <= 0) {
        setSelectedGoodies(null)
        setTotalPrice(getTotalPrice());
        setTotalPriceSaving(getTotalSavingPrice());

        return false;
      }
      else if (minAmount < getTotalPrice() && getTotalPrice() < maxAmount) {
        const prices: any = getTotalPrice() + (price * quantity);
        setTotalPriceSaving(SavingPrices);
        setTotalPrice(prices);
        setSelectedGoodies(item)
        return item;
      } else if (minAmount < getTotalPrice() && getTotalPrice() > maxAmount) {

        setTotalPriceSaving(SavingPrices - price * quantity);
        setTotalPrice(getTotalPrice());
        setSelectedGoodies(null)

        return false;
      }
      // Determine the upcoming goodies

    });

  }, [goodies, getTotalPrice()]);

  //for offer product
  useEffect(() => {
    if (totalPrice === undefined || totalPrice <= 0) {
      setGrandTotal(0);
      setOfferProduct(null);
    } else {
      const nextOfferProduct = goodies.find(item => {
        const { minAmount } = item.constraints;
        return totalPrice < minAmount;
      });

      setOfferProduct(nextOfferProduct || null);
    }
    if (!!totalPrice) {
      setGrandTotal(parseFloat(totalPrice) + parseFloat(deliveryCharge));
    }

  }, [totalPrice, goodies]);
  const fetchCartData = useCallback(async () => {
    try {
      const response = await axios({
        url: apiList.SHOPING_BAG,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          storecode: storeCode,
        },
      });

      setCartData(response.data.data.items);
      setGoodies(response.data.data.goodies);
    } catch (error) {
      console.error("Failed to fetch cart data", error);
    }
  }, [token, storeCode]);
  //end cartdata

  //fetch wallet amount
  const fetchWalletAmount = useCallback(async () => {
    try {
      const response = await axios({
        url: apiList.WALLET + "?page=1",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWalletAmount(response.data.data.wallet.amount);
    } catch (error) {
      console.error("Failed to fetch cart data", error);
    }
  }, [token]);

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await axios({
        url: apiList.COUPONS,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCoupons(response.data);

    } catch (error) {
      console.error("Failed to fetch cart data", error);
    }
  }, [token]);


  const uniqueCoupons = !!Coupons && Coupons.data.filter((obj, index, self) =>
    index === self.findIndex((t) => (
      t.code === obj.code
    ))
  );

  const gpPointButtonsCancel = () => {
    setShowGp(false);
    setGrandTotal((grandTotal + parseFloat(appliedGP)));
    setGrozepPoints(0);
    setApplyGP(0);
  }
  const gpPointButtonApply = () => {
    setGrandTotal((parseFloat(totalPrice) + parseFloat(deliveryCharge) - parseFloat(grozepPoints)));
    setApplyGP(grozepPoints);
    setShowGp(false);
  }

  const bpPointButtonsCancel = () => {
    setGrandTotal((parseFloat(grandTotal) + parseFloat(appliedBP)));
    setGrozepPoints(0);
    setApplyBP(0);
    setShowBp(false);

  }
  const bpPointButtonApply = () => {
    const totalPrc: number = totalPrice + deliveryCharge - promoDiscount;
    setGrandTotal(totalPrc - buy4EarnPoints);
    setApplyBP(parseInt(buy4EarnPoints));
    setShowBp(false);

  }
  const handleBpInputChange = (e) => {
    setBuy4earnPoints(e.target.value.replace(/[^0-9.]/g, ""));
  }

  const handleGpInputChange = (e) => {
    setGrozepPoints(e.target.value.replace(/[^0-9.]/g, ""));
  }

  useEffect(() => {
    if (grozepPoints > gp) {
      setGpMessage('Insufficient Points! Please check wallet');
    } else if (!!grandTotal && grozepPoints > grandTotal) {
      setGpMessage(`You can apply upto ${grandTotal} points`)
    } else {
      setGpMessage(null);
    }
  }, [grozepPoints]);

  useEffect(() => {
    if (applicableCouponAmount == 0) {
      setApplicableCouponAmount(!!grandTotal && grandTotal - ((grandTotal * allowedPercent) / 100));
    }
    else if (buy4EarnPoints > walletAmount) {
      setBpMessage(`You can apply upto ${walletAmount} points`);
    }
    else if (buy4EarnPoints > applicableCouponAmount) {
      setBpMessage(`You can apply upto ${applicableCouponAmount} points`);
    }
    else {
      setBpMessage(null);
    }
  }, [buy4EarnPoints]);
  let cartItems = null;
  if (selectedGoodies !== null) {
    const updatedArray = [...cartData, selectedGoodies];
    cartItems = updatedArray.filter(item => item !== null);
  } else {
    cartItems = cartData.filter(item => item !== null);
  }



  const placeOrder = async () => {
    setLoader(true);
    const placeOrderData =
    {
      "phone": userInfo.user.phone,
      "storecode": storeCode,
      "address": defaultAddress,
      "coupons": appliedCoupons,
      "deliveryCharge": deliveryCharge,
      "orderChannel": "web",
      "promoDiscount": promoDiscount,
      "loyaltyPoint": parseFloat(appliedBP),
      "point": parseFloat(appliedGP),
      "paymentMode": "postPaid",
      "items": cartItems,
      "goodyId": !!selectedGoodies && selectedGoodies.id ? selectedGoodies.id : null,
    };
    try {
      const response: any = await axios({
        url: apiList.PLACE_ORDER,
        method: "POST",
        data: placeOrderData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaceOrderResponse(response.data);
      localStorage.setItem("placeOrderResppnse", JSON.stringify(response.data));
      ClearCart();
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Failed to placeorder", error);
    }

  }
  //clear cart 


  const ClearCart = async () => {
    try {
      const result = await axios({
        url: apiList.SHOPING_BAG,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // Return the response object
      setClearCartResponse(result.data);
      return result;

    } catch (error) {
      console.log('Error in handleAddToCart:', error);
      throw error; // Re-throw to handle it in the calling function
    }
  }
  //end clear cart

  useEffect(() => {
    setApplicableCouponAmount(0);
    setApplyBP(0);
    setApplyGP(0);

    if (token && storeCode) {
      fetchCartData();

    }

  }, [state.cart]);

  useEffect(() => {
    if (!!placeOrderResponse && placeOrderResponse.status) {
      localStorage.removeItem('cart');
      window.location.replace('/order/status');
    }

  }, [placeOrderResponse]);

  return (
    <Suspense fallback={<Spinner />}>
    <Fragment>
      <ProtectedPage/>
      {grandTotal > 0 ? <Grid container spacing={6}>
        <Modal show={show} onHide={handleClose} style={{ marginTop: '60px' }}>

          <Modal.Body>
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              ml={3}
              mr={3}
            >
              <Typography fontSize={18} fontWeight={600}>Coupons</Typography>
              <Typography>
                <FontAwesomeIcon icon="fa-solid fa-close" onClick={handleClose} />
              </Typography>
            </FlexBox>
            <CouponsComp uniqueCoupons={uniqueCoupons} allCoupons={Coupons} token={token} grandTotal={grandTotal} setPromoDiscount={setPromoDiscount} setGrandTotal={setGrandTotal} setFilterCoupons={setFilterCoupons} setActiveCoupon={setActiveCoupon} setAppliedCoupons={setAppliedCoupons} setApplicableCouponAmount={setApplicableCouponAmount} applicableCouponAmount={applicableCouponAmount} appliedCoupons={appliedCoupons} activeCoupon={activeCoupon} filterCoupons={filterCoupons} setMessageData={setMessageData} applyBP={appliedBP} />
          </Modal.Body>
        </Modal>

        <Grid item lg={8} md={8} xs={12}>
          <ShowMessage messageData={messageData} />
          <Notification notificatonData={notificatonData} />
          {!!offerProduct && <OfferProduct
            mb="1.5rem"
            id={offerProduct.productId}
            key={offerProduct.productId}
            qty={offerProduct.constraints?.quantity}
            name={offerProduct.name}
            price={offerProduct.constraints?.price}
            imgUrl={offerProduct.imageUrl}
            productVariant={offerProduct.variantId}
            size={offerProduct.sizes?.value + ' ' + offerProduct.sizes?.unit}
            currentPrice={offerProduct?.supplies[0].mrp}
            expDate={offerProduct?.supplies[0].expDate}
            minAmount={offerProduct.constraints?.minAmount}
          />}

          {cartData && cartData.map((item, index) => {
            const totalQuantity = calculateTotalQuantity(item.supplies);

            return (
              <ProductCard7
                mb="1.5rem"
                id={item.productId}
                key={index}
                qty={item.quantity}
                slug={item.slug}
                name={item.name}
                price={item.supplies[0].mrp - item.supplies[0].off}
                mrp={item.supplies[0].mrp}
                imgUrl={item.imageUrl}
                maxQuantity={totalQuantity}
                productVariant={item.variantId}
                storeCode={storeCode}
                token={token}
                limit={item.limit}
                size={item.size}
                setNotificationData={setNotificationData}
                brand={item.brand}
                setPromoDiscount={setPromoDiscount}
                setGrozepPoints={setGrozepPoints}
                setBuy4earnPoints={setBuy4earnPoints}
                setAppliedCoupons={setAppliedCoupons}

              />

            )
          }
          )}

          {!!selectedGoodies &&
            <GoodiesProduct
              mb="1.5rem"
              id={selectedGoodies.productId}
              key={selectedGoodies.id}
              qty={selectedGoodies.constraints?.quantity}
              name={selectedGoodies.name}
              price={selectedGoodies.constraints?.price}
              imgUrl={selectedGoodies.imageUrl}
              productVariant={selectedGoodies.variantId}
              size={selectedGoodies.sizes?.value + ' ' + selectedGoodies.sizes?.unit}

            />}
        </Grid>


        <Grid item lg={4} md={4} xs={12}>
          <Card1 borderRadius={10}>
            <FlexBox alignItems="center"
              justifyContent="space-between"

            >
              <Typography>
                <img src="/assets/images/icons/Group.svg" alt="timer" height={30} />
              </Typography>
              <Typography fontWeight="700" fontSize={18} mr="10px">
                Delivered within {deliveryTime}
              </Typography>
              <Typography>
                <img src="/assets/images/icons/image 74.png" alt="vehical" height={30} />
              </Typography>
            </FlexBox>


            <Divider mt={20} />
            <FlexBox justifyContent="space-between" alignItems="center" mb="1rem" mt={20}>
              <Typography >Total</Typography>
              <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                <del>{!!totalPriceSaving && currency(totalPriceSaving)}</del> &nbsp; {!!totalPrice && currency(totalPrice)}
              </Typography>
            </FlexBox>
            <Divider mb="1rem" />
            <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">

              <Typography >Delivery charge</Typography>

              <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                + {!!totalPrice && currency((totalPrice > metaData?.minOrderAmount ? 0 : metaData?.deliveryCharge))}
              </Typography>
            </FlexBox>
            {appliedGP ? <><Divider mb="1rem" />
              <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">

                <Typography >Grozep  Points</Typography>

                <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                  - {currency(appliedGP)}
                </Typography>
              </FlexBox></> : null}
            {appliedBP ? <><Divider mb="1rem" />
              <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">

                <Typography >Buy4earn  Points</Typography>

                <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                  - {currency(appliedBP)}
                </Typography>
              </FlexBox></> : null}

            {
              !!promoDiscount && promoDiscount ? <>  <Divider mb="1rem" />
                <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">

                  <Typography >Promo Discount</Typography>

                  <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                    - {currency(promoDiscount)}
                  </Typography>
                </FlexBox></> : ''

            }

            <Divider mb="1rem" />

            <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
              <Typography >Grand Total</Typography>

              <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                {!!grandTotal && currency(grandTotal)}
              </Typography>
            </FlexBox>
          
            {grozepPoints  ? null : <>
            {!!Coupons && Coupons.data.length?
            <>
            <Divider mb="1rem" />
              <FlexBox alignItems="center"
                justifyContent="space-between" mb="1rem">

                <Typography fontWeight="600" fontSize={17} pr="20px"  >
                  <img src="/assets/images/icons/Group-1.svg" alt="timer" height={25} style={{ paddingRight: '10px' }} />
                  Promo Coupons
                </Typography>
                <Typography>
                  <Button variant="outlined" color="success" fullwidth borderRadius={30} width={89} height={30} onClick={handleShow}>
                    Apply
                  </Button>
                </Typography>
              </FlexBox>
              </>
              :null}
              

{walletAmount?<>
  <Divider mb="1rem" />
              <FlexBox alignItems="center"
                justifyContent="space-between" mb="1rem">
                <Typography fontWeight="600" fontSize={18} pr="0px"  >
                  <img src="/assets/images/icons/Wallet Icon.svg" height={25} />
                </Typography>
                {ShowBp ? <Typography fontWeight="600" fontSize={18} pr="20px"  >

                  <TextField type="text"
                    style={{ borderRight: '0px', borderLeft: '0px', borderTop: '0px', marginLeft: '10px', marginRight: '10px' }}
                    fullwidth onChange={handleBpInputChange}
                    value={buy4EarnPoints}
                    errorText={bpMessage}
                  />

                </Typography> : <Typography fontWeight="600" fontSize={17} pr="20px" >
                  {walletAmount} Buy4earn points
                </Typography>}

                <Typography>

                  {ShowBp ?
                    <>

                      {bpMessage || buy4EarnPoints == 0 ? <Button variant="outlined" color="success" onClick={bpPointButtonsCancel} fullwidth borderRadius={30} width={89} height={30}>
                        Cancel
                      </Button> : <Button variant="outlined" color="success" onClick={bpPointButtonApply} fullwidth borderRadius={30} width={89} height={30}>
                        Confirm
                      </Button>}
                    </>
                    : <Button variant="outlined" color="success" onClick={() => setShowBp(true)} fullwidth borderRadius={30} width={89} height={30}>
                      Redeem
                    </Button>}

                </Typography>

              </FlexBox>
</>:null}
              
            </>}


            {appliedCoupons.length > 0 || buy4EarnPoints ? null : <>
              <Divider mb="1rem" />
              <FlexBox alignItems="center"
                justifyContent="space-between" mb="1rem">
                <Typography fontWeight="600" fontSize={17} pr="0px"  >
                  <img src="/assets/images/icons/Wallet Icon.svg" height={25} />
                </Typography>
                {ShowGp ? <Typography fontWeight="600" fontSize={18} pr="20px"  >
                  <TextField type="text"
                    style={{ borderRight: '0px', borderLeft: '0px', borderTop: '0px', marginLeft: '10px', marginRight: '10px' }}
                    fullwidth value={grozepPoints} onChange={handleGpInputChange}

                    errorText={gpMessage}

                  />
                </Typography> : <Typography fontWeight="600" fontSize={17} pr="20px" >
                  {gp.toFixed(2)} Grozep points
                </Typography>}

                <Typography>

                  {ShowGp ?

                    <>
                      {gpMessage || grozepPoints == 0 ? <Button variant="outlined" color="success" onClick={gpPointButtonsCancel} fullwidth borderRadius={30} width={89} height={30}>
                        Cancel
                      </Button> : <Button variant="outlined" color="success" onClick={gpPointButtonApply} fullwidth borderRadius={30} width={89} height={30}>
                        Confirm
                      </Button>}

                    </>


                    : <Button variant="outlined" color="success" onClick={() => setShowGp(true)} fullwidth borderRadius={30} width={89} height={30}>
                      Redeem
                    </Button>}

                </Typography>

              </FlexBox>
            </>}

           
            <FlexBox alignItems="center"
              justifyContent="space-evenly" mb="1rem"
              backgroundColor='#009FF9'
              borderRadius={10}
              height={50}
              color='#FFFFFF'
            >
              <Typography > <img src="/assets/images/icons/Saving Icon.svg" height={25} /></Typography>
              <Typography fontWeight="600" fontSize={14} pr="20px"  >
                You are  saving {currency(totalPriceSaving - totalPrice)} on this purchase.

              </Typography>

            </FlexBox>

            <Divider mb="1rem" />
            <Box mt="2rem">

              <Typography fontSize={16} mb={10}>Cancellation Policy</Typography>
              <Divider mb="1.5rem" />
              <Typography mb={10}>Call help & support for the order cancellations or returns.We ensure instant refunds for a hassle-free experience.Your satisfaction is our priority.</Typography>
            </Box>
            {loader ? <Button variant="contained" color="primary" borderRadius={10} disabled onClick={placeOrder} fullwidth >
              Place order now
              &nbsp; <Spinner />
            </Button> : <Button variant="contained" color="primary" borderRadius={10} onClick={placeOrder} fullwidth >
              Place order now

            </Button>}



          </Card1>

        </Grid>
      </Grid> :


        <FlexBox
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          height="70vh">
          <Image src="/assets/images/logos/shopping-bag.svg" width={90} height={90} alt="bonik" />
          <Paragraph mt="1rem" color="text.muted" textAlign="center" maxWidth="200px">
            Your shopping bag is empty. Start shopping
          </Paragraph>
        </FlexBox>

      }

    </Fragment>
    </Suspense>
  );
}

