"use client";
import { Fragment, useEffect } from "react";
import Box from "@component/Box";
import Container from "@component/Container";
import Navbar from "@component/navbar/Navbar";
import { Carousel } from "@component/carousel";
import { CarouselCard1 } from "@component/carousel-cards";

// ======================================================
type Props = { carouselData: any, menuItems: any, metaData: any };

// ======================================================

export default function Section1({ carouselData, menuItems, metaData }: Props) {

  useEffect(() => {
    localStorage.setItem('metaData', JSON.stringify(metaData));
  }, [metaData]);

  return (
    <Fragment>
      {!!menuItems && menuItems?<Navbar navListOpen={false} datas={menuItems.data} />:''}
      
{!!carouselData && carouselData?<Box bg="gray.white" mb="3.75rem">
        <Container pb="1rem">
          <Carousel
            spacing="0px"
            infinite={true}
            autoPlay={true}
            showDots={false}
            visibleSlides={1}
            showArrow={false}
            totalSlides={carouselData.length}>
            {carouselData.map((item, index) => (
              <CarouselCard1
                key={index}
                title={item.title}
                image={item.imageUrl}
                buttonText={item.title}
                description={item.description}
                targetScreen={item.targetScreen}
                isClickable={item.isClickable}
              />
            ))}
          </Carousel>
        </Container>
      </Box>:null}
      

    </Fragment>
  );
}
