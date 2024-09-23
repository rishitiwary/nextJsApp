import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import { H3 } from "@component/Typography";
import { ProductVariantCard } from "@component/product-cards";
import Product from "@models/product.model";
import { useAppContext } from "@context/app-context";
// ============================================================
type Props = {
  products: Product[],
  storeCode: string;
  token: string;
  setNotificationData: string;
  setSelectedVariantId: any;
  brand:string;
};
// ============================================================

export default function ProductVariant({ products, storeCode, token, setNotificationData, setSelectedVariantId,brand }: Props) {

  const id: string = products.id;
  const name: string = products.name;
  const slug: string = products.slug;
  const sizes: any = products.sizes;
  const { state, dispatch } = useAppContext();


  return (
    <Box mb="3.75rem">
    <H3 mb="1.5rem">Product Variants</H3>
  
    <Grid container spacing={8}>
      {products.productVariant.map((item, index) => {

      const sizess = sizes.find((items) => {
        return items.id === item.sizeId;
      });

    
        let totalQuantity = 0; // Reset for each product variant
        // Calculate total quantity
        item.supplies.forEach((q) => {
          totalQuantity += q.quantity;
        });
  
        // Return the JSX for each item
        return (
          <Grid item lg={3} md={4} sm={6} xs={12} key={item.id}>
            <ProductVariantCard
              hoverEffect
              vid={index}
              key={index}
              id={id}
              slug={slug}
              mrp={item.supplies[0].mrp}
              offPrice={item.supplies[0].mrp - item.supplies[0].off}
              title={item.name}
              brand
              off={Math.round((100 * item.supplies[0].off) / item.supplies[0].mrp)}
              images={item.imageURL[0]}
              imgUrl={item.imageURL[0]}
              value={sizess.value}
              unit={sizess.unit}
              maxQuantity={totalQuantity}
              productVariant={item.id}
              storeCode={storeCode}
              token={token}
              limit={item.limit}
              setNotificationData={setNotificationData}
              setSelectedVariantId={setSelectedVariantId}
            />
          </Grid>
        );
      })}
    </Grid>
  </Box>
  );
}
