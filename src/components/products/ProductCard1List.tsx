import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Pagination from "@component/pagination";
import { ProductCard1 } from "@component/product-cards";
import { SemiSpan } from "@component/Typography";
import Product from "@models/product.model";

// ==========================================================
type Props = { products: Product[],token:any,storeCode:any,setNotificationData:any,type:string };
// ==========================================================

export default function ProductGridView({ products,storeCode,token,setNotificationData,type }: Props) {

  return (
    <div>
      <Grid container spacing={6}>
        {products && products.map((item,index) => (
          
          <Grid item lg={type==='search'?3:4} sm={6} xs={12} key={item.id}>
            <ProductCard1
               key={index}
               id={item.id}
               slug={item.slug}
               mrp={(item.productVariant[0].supplies[0].mrp)}
               offPrice={(item.productVariant[0].supplies[0].mrp - item.productVariant[0].supplies[0].off)}
               title={item.name}
               off={Math.round((100 * item.productVariant[0].supplies[0].off) / item.productVariant[0].supplies[0].mrp)}
               images={item.productVariant[0].imageURL[0]}
               imgUrl={item.productVariant[0].imageURL[0]}
               value={item.sizes[0].value}
               unit={item.sizes[0].unit}
               maxQuantity={item.productVariant[0].supplies[0].quantity}
               productVariant={item.productVariant[0].id}
               storeCode={storeCode}
               token={token}
               limit={item.productVariant[0].limit}
               setNotificationData={setNotificationData}
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt="32px">
        {/* <SemiSpan>Showing 1-9 of 1.3k Products</SemiSpan> */}
        <>
          {products && products.length !== undefined ?
            //  <Pagination pageCount={products && products.length} /> 
            null
            :
            <><h1>Not found any records</h1></>}


        </>
      </FlexBox>
    </div>
  );
}
