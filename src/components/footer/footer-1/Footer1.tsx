import Link from "next/link";

import Box from "@component/Box";
import Image from "@component/Image";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import AppStore from "@component/AppStore";
import Container from "@component/Container";
import Typography, { Paragraph } from "@component/Typography";

// STYLED COMPONENTS
import { StyledLink } from "./styles";
// CUSTOM DATA
import { aboutLinks, customerCareLinks, iconList } from "./data";

export default function Footer1() {
  return (
    <footer>
      <Box bg="#000">
        <Container p="1rem" color="white">
          <Box py="5rem" overflow="hidden">
            <Grid container spacing={6}>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <Link href="/">
                  <Image alt="logo" mb="1.25rem" src="/assets/images/logo.png"  height={50} width={100}/>
                </Link>

                <Paragraph mb="1.25rem" color="gray.500">
                Introducing our Grozep, a revolutionary application that transcends the traditional with a cutting-edge interface and innovative features, Grozep seamlessly merges retail therapy with lucrative opportunities.
                </Paragraph>

                <AppStore />
              </Grid>

              <Grid item lg={2} md={6} sm={6} xs={12}>
                <Typography mb="1.25rem" lineHeight="1" fontSize="25px" fontWeight="600">
                  About Us
                </Typography>

                <div>
                  {aboutLinks.map((item, ind) => (
                    <StyledLink href={item.link} key={ind}>
                      {item.title}
                    </StyledLink>
                  ))}
                </div>
              </Grid>

              <Grid item lg={3} md={6} sm={6} xs={12}>
                <Typography mb="1.25rem" lineHeight="1" fontSize="25px" fontWeight="600">
                  Customer Care
                </Typography>

                <div>
                  {customerCareLinks.map((item, ind) => (
                    <StyledLink href={item.link} key={ind}>
                      {item.title}
                    </StyledLink>
                  ))}
                </div>
              </Grid>

              <Grid item lg={3} md={6} sm={6} xs={12}>
                <Typography mb="1.25rem" lineHeight="1" fontSize="25px" fontWeight="600">
                  Contact Us
                </Typography>

                <Typography py="0.3rem" color="gray.500">
                GARHWA (Headquarter),
                Sukbana, Near Railway Crossing, Garhwa, Jharkhand - 822114
                </Typography>

                <Typography py="0.3rem" color="gray.500">
                  Email: contactus@grozep.com
                </Typography>

                <Typography py="0.3rem" mb="1rem" color="gray.500">
                  Phone: +91 8448444943
                </Typography>

                <FlexBox className="flex" mx="-5px">
                  {iconList.map((item) => (
                    <a
                      href={item.url}
                      target="_blank"
                      key={item.iconName}
                      rel="noreferrer noopenner">
                      <Box m="5px" p="10px" size="small" borderRadius="50%" bg="rgba(0,0,0,0.2)">
                        <Icon size="12px" defaultcolor="auto">
                          {item.iconName}
                        </Icon>
                      </Box>
                    </a>
                  ))}
                </FlexBox>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </footer>
  );
}