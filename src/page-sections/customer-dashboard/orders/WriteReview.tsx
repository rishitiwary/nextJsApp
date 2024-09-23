"use client";

import Box from "@component/Box";
import Avatar from "@component/avatar";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography, { H6 } from "@component/Typography";
import { currency } from "@utils/utils";

export default function WriteReview({ item }: { item: any }) {
  return (
    <FlexBox px="1rem" py="0.5rem" flexWrap="wrap" alignItems="center" key={item.id}>
      <FlexBox flex="2 2 260px" m="6px" alignItems="center">
        <Avatar src={item.imageUrl} size={64} />

        <Box ml="20px">
          <H6 my="0px">{item.product_name}</H6>
          <Typography fontSize="14px" color="text.muted">
            {item.size}
          </Typography>
          <Typography fontSize="14px" color="text.muted">
            {currency(item.mrp-item.off)} x {item.quantity}
          </Typography>
          
        </Box>
      </FlexBox>

      <FlexBox flex="1 1 260px" m="6px" alignItems="center">
        <Typography fontSize="14px" color="text.muted">
          {item.brand} {item.name}
        </Typography>
      </FlexBox>

      <FlexBox flex="160px" m="6px" alignItems="center">
        {currency(item.quantity*(item.mrp-item.off))}
        {/* <Button variant="text" color="primary">
          <Typography fontSize="14px">Write a Review</Typography>
        </Button> */}
      </FlexBox>
    </FlexBox>
  );
}
