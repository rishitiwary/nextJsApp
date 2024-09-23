"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@component/Box";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import Container from "@component/Container";
import NextImage from "@component/NextImage";
import Typography from "@component/Typography";
import CategorySectionHeader from "@component/CategorySectionHeader";
import Category from "@models/category.model";


// ============================================================
type Props = { categories: Category[] };
// ============================================================

export default function Section3({ categories }: Props) {
  const router = useRouter();
  const handleClick = async (item) => {
    const subCategory = JSON.stringify(item.subcategories);
    await localStorage.setItem("subcategories", subCategory);
    await router.push(`/product/search/${(item.name.replace(/[^A-Z0-9]/ig, "-")).toLowerCase()}`);
  }
  return (
    <Container mb="70px">
      {!!categories && categories ? <><CategorySectionHeader title="Categories" iconName="categories" />

        <Grid container spacing={6}>
          {categories.map((item) => (

            <Grid item lg={2} md={3} sm={6} xs={6} key={item.id} >
              <Card
                cursor="pointer"
                onClick={() => handleClick(item)}
                hoverEffect
                p="0.75rem"
                display="flex"
                borderRadius={8}
                boxShadow="small"
                alignItems="center">
                <Box width={50} height={60}>
                  <NextImage width={52} height={20} alt="fashion" src={item.imageUrl} />

                </Box>

                <Typography fontWeight={600} fontSize={14} ml="8px">
                  {item.name}
                </Typography>
              </Card>

            </Grid>

          ))}
        </Grid></> : null}

    </Container >
  );
}
