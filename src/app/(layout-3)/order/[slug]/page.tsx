"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Image from "@component/Image";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography from "@component/Typography";
import { useEffect } from "react";

interface Props {
  params: { slug: string };
}
export default function OrderStatus({ params }: Props) {
  const router = useRouter();
  const slug = params.slug;
  let response: any=!!localStorage.getItem('placeOrderResppnse') && JSON.parse(localStorage.getItem('placeOrderResppnse'));

  const handleGoBack=()=>{
    localStorage.removeItem('placeOrderResppnse');
    router.back();
  }

  return (
    <FlexBox
      px="1rem"
      minHeight="100vh"
      alignItems="center"
      flexDirection="column"
      justifyContent="left">
      {response.status ? <><Image src="/assets/images/icons/order-success.png" maxWidth="320px" width="100%" mb="2rem" />
        <Typography fontWeight="600" fontSize={18} mb={2} style={{ textTransform: 'capitalize' }} >
          <Image src="/assets/images/icons/checked.png" alt="checked" width="30px" mr={2} />  Order Confirmed
        </Typography>
        <Typography fontWeight={600} fontSize={15} mb={2} paddingLeft={10}>
          Thanks for Shopping with us!
        </Typography>
        <Typography fontWeight={600} fontSize={15} mb={2} paddingLeft={10}>
          Order ID - {response.data.id}
        </Typography>

        <Typography fontWeight={600} fontSize={15} mb={2} paddingLeft={10}>
          Delivery by {response.data.dateTime}
        </Typography>
        <br />
        <Image src="/assets/images/icons/order icons.svg" alt="order-status" width="100%" maxWidth="700px" />
        <FlexBox flexWrap="wrap">
          <Typography fontWeight={600} fontSize={15} mb={2} paddingLeft={10}>

            <Image src="/assets/images/icons/locatiion icon.svg" alt="location" width="30px" />
          </Typography>
          <Typography fontWeight={600} fontSize={15} mb={2} paddingLeft={10}>
            {response.data.name},
             {response.data.address.locality}  {response.data.address.address}
             , {response.data.address.pinCode}
          </Typography>

        </FlexBox>
        <FlexBox flexWrap="wrap">
          <Button variant="contained" onClick={handleGoBack} borderRadius={30} color="primary" m="0.5rem">
            Continue Shopping
          </Button>
        </FlexBox></>
        :
        <><Image src="/assets/images/icons/order-failed.png" maxWidth="320px" width="100%" mb="2rem" />
          <Typography fontWeight="600" fontSize={18} mb={2} style={{ textTransform: 'capitalize' }} >
            <Image src="/assets/images/icons/failed.png" alt="checked" width="30px" mr={2} />  Order Failed
          </Typography>
          <Typography fontWeight={600} fontSize={15} mb={2} paddingLeft={10}>
           {response.message}
          </Typography>
        

          <br />


          <FlexBox flexWrap="wrap">
            <Button variant="contained" onClick={handleGoBack} borderRadius={30} color="white" backgroundColor="red" m="0.5rem" width="200px">
              Go Back
            </Button>
          </FlexBox></>}


    </FlexBox>
  );
}
