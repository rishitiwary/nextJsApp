"use client";
import { Fragment, useState, useEffect,Suspense } from "react";
import axios from "axios";
import apiList from "@utils/__api__/apiList";
import ProductIntro from "@component/products/ProductIntro";
import ProductView from "@component/products/ProductView";
import Notification from "@component/Notification";
import { useSearchParams } from 'next/navigation'

// ==============================================================
interface Props {
  params: { slug: string };
}
// ==============================================================

const ProductDetails = ({ params }: Props) => {

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(0);
  const [storeCode, setStoreCode] = useState('');
  const [token, setToken] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [notificatonData, setNotificationData] = useState({ 'status': false });
  const fetchProductInfo = async () => {
   
    try {
      const result = await axios({
        url: apiList.PRODUCT_DETAILS + (params.slug as string),
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          storecode: storeCode
        }
      });
      setResponse(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!!response && response.data[0]) {
      setSelectedVariant({ ...response.data[0].productVariant[selectedVariantId] });
    }
  }, [response, selectedVariantId])


  useEffect(() => {
    const locationResponse = localStorage.getItem('locationResponse');
    const userData = localStorage.getItem('userData');

    if (locationResponse) {
      try {
        const parsedData = JSON.parse(locationResponse);
        if (parsedData && parsedData.storecode) {
          setStoreCode(parsedData.storecode);
        } else {
          console.error("Location response does not contain 'storecode'");
        }
      } catch (error) {
        console.error("Error parsing location response:", error);
      }
    }

    if (userData) {
      setToken(JSON.parse(userData).token);
    }
  }, []);

  useEffect(() => {
    if (storeCode && token) {
      fetchProductInfo();
    }
  }, [storeCode, token]);

  if (!response) {
    return <div>Loading...</div>;
  }

  let totalQuantity: number = 0;
  let datas = response;
  if (datas && datas.data[0]) {
    datas = datas.data[0];

    !!selectedVariant && selectedVariant.supplies.forEach((q: any) => {
      totalQuantity += q.quantity;
    });

  }


  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Fragment>
      <Notification notificatonData={notificatonData} />
      {!!selectedVariant && selectedVariant ? <ProductIntro
        id={datas.id}
        slug={datas.slug}
        brand={datas.brand}
        mrp={(selectedVariant.supplies[0].mrp)}
        offPrice={(selectedVariant.supplies[0].mrp - selectedVariant.supplies[0].off)}
        title={datas.name}
        off={Math.round((100 * selectedVariant.supplies[0].off) / selectedVariant.supplies[0].mrp)}
        images={selectedVariant.imageURL[0]}
        imgUrl={selectedVariant.imageURL[0]}
        value={datas.sizes[0].value}
        unit={datas.sizes[0].unit}
        totalQuantity={totalQuantity}
        productVariant={selectedVariant.id}
        storeCode={storeCode}
        token={token}
        limit={selectedVariant.limit}
        setNotificationData={setNotificationData}
        description={datas.description}
      /> : ''}

      <ProductView
        name={datas.name}
        brand={datas.brand}
        description={datas.description}
        productVariant={datas}
        storeCode={storeCode}
        token={token}
        setNotificationData={setNotificationData}
        setSelectedVariantId={setSelectedVariantId}

      />
    </Fragment>
    </Suspense>
  );
};

export default ProductDetails;
