"use client";

import { useEffect, useState } from "react";

import Grid from "@component/grid/Grid";
import Container from "@component/Container";
import { ProductCard1 } from "@component/product-cards";
import CategorySectionCreator from "@component/CategorySectionCreator";
import useWindowSize from "@hook/useWindowSize";
import Product from "@models/product.model";
import Notification from "@component/Notification";
// =============================================================
type Props = { moreItems: Product[] };
// =============================================================

export default function Section2({ moreItems }: Props) {
  const [storeCode, setStoreCode] = useState('');
  const [token, setToken] = useState('');
  const datas = !!moreItems && moreItems.data;
  const width = useWindowSize();
  const [notificatonData, setNotificationData] = useState({ 'status': false });


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




  return (
    <Container mb="70px">
       {!!datas && datas.length ?
      <CategorySectionCreator iconName="light" title="More For You">
        <Notification notificatonData={notificatonData} />
        <Grid container spacing={6}>
          {datas.map((item, ind) => {
            let totalQuantity = 0; // Reset for each product variant
            // Calculate total quantity
            item.productVariant[0].supplies.forEach((q) => {
              totalQuantity += q.quantity;
            });
            return (

              <Grid item lg={3} md={4} sm={6} xs={6} key={ind}>
                <ProductCard1
                  key={ind}
                  id={item.id}
                  slug={item.slug}
                  mrp={(item.productVariant[0].supplies[0].mrp)}
                  offPrice={(item.productVariant[0].supplies[0].mrp - item.productVariant[0].supplies[0].off)}
                  title={item.name}
                  brand={item.brand}
                  off={Math.round((100 * item.productVariant[0].supplies[0].off) / item.productVariant[0].supplies[0].mrp)}
                  images={item.productVariant[0].imageURL[0]}
                  imgUrl={item.productVariant[0].imageURL[0]}
                  value={item.sizes[0].value}
                  unit={item.sizes[0].unit}
                  maxQuantity={totalQuantity}
                  productVariant={item.productVariant[0].id}
                  storeCode={storeCode}
                  token={token}
                  limit={item.productVariant[0].limit}
                  setNotificationData={setNotificationData}

                />
              </Grid>
            )
          })}
        </Grid> 


      </CategorySectionCreator>
      : null}
    </Container>
  );
}
