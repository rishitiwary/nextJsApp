"use client";

import { useEffect, useState, useMemo } from "react";
import Box from "@component/Box";
import { Carousel } from "@component/carousel";
import { ProductCard1 } from "@component/product-cards";
import CategorySectionCreator from "@component/CategorySectionCreator";
import useWindowSize from "@hook/useWindowSize";
import Product from "@models/product.model";
import Notification from "@component/Notification";
// =============================================================
type Props = { productsData: Product[] };
// =============================================================

export default function Section2({ productsData }: Props) {
  const [storeCode, setStoreCode] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [notificatonData, setNotificationData] = useState({ status: false });
  const [visibleSlides, setVisibleSlides] = useState(4);
  const width = useWindowSize();

  // Get locationResponse and userData from localStorage
  useEffect(() => {
    try {
      const locationResponse = localStorage.getItem('locationResponse');
      const parsedLocation = locationResponse ? JSON.parse(locationResponse) : null;
      if (parsedLocation?.storecode) {
        setStoreCode(parsedLocation.storecode);
      }

      const userData = localStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      if (parsedUser?.token) {
        setToken(parsedUser.token);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  // Adjust the number of visible slides based on screen width
  useEffect(() => {
    if (width < 500) setVisibleSlides(2);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);

  // Memoized category link
  const categoryLink = useMemo(() => `view-all/${productsData?.category}`, [productsData]);

  // Product card rendering logic
  const renderProductCards = useMemo(() => {
    return productsData?.products?.map((item, ind) => {
      const totalQuantity = item.productVariant[0].supplies.reduce(
        (acc, q) => acc + q.quantity,
        0
      );
      
      const { supplies, imageURL,id, limit } = item.productVariant[0];

      return (
        <Box py="0.25rem" key={ind}>
          <ProductCard1
            key={item.id}
            id={item.id}
            slug={item.slug}
            mrp={supplies[0].mrp}
            offPrice={supplies[0].mrp - supplies[0].off}
            title={item.name}
            brand={item.brand}
            off={Math.round((100 * supplies[0].off) / supplies[0].mrp)}
            images={imageURL[0]}
            imgUrl={imageURL[0]}
            value={item.sizes[0]?.value}
            unit={item.sizes[0]?.unit}
            maxQuantity={totalQuantity}
            productVariant={id}
            storeCode={storeCode}
            token={token}
            limit={limit}
            setNotificationData={setNotificationData}
          />
        </Box>
      );
    });
  }, [productsData, storeCode, token]);

  return (
    <CategorySectionCreator iconName="light" title={productsData?.category} seeMoreLink={categoryLink}>
      <Box mt="-0.25rem" mb="-0.25rem">
        <Notification notificatonData={notificatonData} />
        {renderProductCards?.length > 0 && (
          <Carousel totalSlides={renderProductCards.length} visibleSlides={visibleSlides}>
            {renderProductCards}
          </Carousel>
        )}
      </Box>
    </CategorySectionCreator>
  );
}
