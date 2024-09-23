import Link from "next/link";
import Box from "@component/Box";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import Container from "@component/Container";
import ProductCard4 from "@component/product-cards/ProductCard4";
import ProductCard5 from "@component/product-cards/ProductCard5";
import CategorySectionHeader from "@component/CategorySectionHeader";
import Brand from "@models/Brand.model";
import Product from "@models/product.model";

// ===================================================================
type Props = { topRatedBrands: Brand[]; topRatedList: Product[] };
// ===================================================================

export default function Section4({ topRatedBrands, topRatedList }: Props) {
  const topRated:any=topRatedList.data;
  const topBrands:any=topRatedBrands.data;

  return (
    <Box mb="3.75rem">
      <Container>
        <Grid container spacing={6}>
          <Grid item lg={6} xs={12}>
            <CategorySectionHeader iconName="ranking-1" title="Top Ratings" seeMoreLink="#" />

            <Card p="1rem" borderRadius={8}>
              <Grid container spacing={4}>
                {topRated.slice(0,4).map((item) => (
                  <Grid item md={3} sm={6} xs={6} key={item.title}>
                    <Link href={`/product/search/${item.slug}`}>
                      <ProductCard4
                        title={item.name}
                        price={item.productVariant[0].supplies[0].mrp-item.productVariant[0].supplies[0].off}
                        imgUrl={item.productVariant[0].imageURL[0]}
                        rating={item.rating || 4}
                        reviewCount={item.reviews?.length || 4}
                      />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          <Grid item md={6} xs={12}>
            <CategorySectionHeader iconName="Group" title="Featured Brands" seeMoreLink="#" />

            <Card p="1rem" borderRadius={8}>
              <Grid container spacing={4}>
                {topBrands.slice(0,8).map((item) => (
                  <Grid item sm={3} xs={6} key={item.id}>
                    <Link href={`/product/search/${item.slug}`}>
                      <ProductCard5 height={100} width={200} title={item.name}  imgUrl={item.imageUrl} />
                    </Link>
                  </Grid>
            
                  
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
