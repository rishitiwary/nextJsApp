import styled from "styled-components";
// GLOBAL CUSTOM COMPONENTS
import { Button } from "@component/buttons";
import Typography from "@component/Typography";
import Image from "@component/Image";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
// STYLED COMPONENT
const StyledCarouselCard1 = styled.div`
  display: flex;
  text-align: left;
  align-items: center;
  padding: 1rem 0 1rem 2rem;
  justify-content: space-between;

  .title {
    font-size: 50px;
    margin-top: 0px;
    line-height: 1.2;
    margin-bottom: 1.35rem;
  }

  .image-holder {
    position: relative;
    img {
      width: 100%;
    }
  }

  @media only screen and (max-width: 900px) {
    margin-left: 0px;
    padding-left: 0px;

    .title {
      font-size: 32px;
    }
  }

  @media only screen and (max-width: 425px) {
    .title {
      font-size: 16px;
    }
    .title + * {
      font-size: 13px;
    }
    .button-link {
      font-size: 13px;
      padding: 0.66rem 0.95rem;
    }
  }
`;

// ===============================================
interface Props {
  title: string;
  image: string;
  buttonText: string;
  description: string;
  isClickable: boolean;
  targetScreen: string;
}
// ===============================================

export default function CarouselCard1({ title, image, buttonText, description, isClickable, targetScreen }: Props) {

  return (

    <FlexBox
      px="1rem"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    marginTop={40}
    marginBottom={4}
   
      >
      <Image
        src={image}
        alt={title}
        width="100%"
        maxHeight="500px"
        borderRadius={10}
      />

    </FlexBox>

  );
}
