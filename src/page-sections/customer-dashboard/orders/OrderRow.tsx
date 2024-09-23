"use client";

import Link from "next/link";
import { format } from "date-fns";

import Box from "@component/Box";
import { Chip } from "@component/Chip";
import Hidden from "@component/hidden";
import Icon from "@component/icon/Icon";
import TableRow from "@component/TableRow";
import { IconButton } from "@component/buttons";
import Typography, { H5, SemiSpan, Small } from "@component/Typography";
import { currency } from "@utils/utils";
import Order from "@models/order.model";
import { useEffect } from "react";


// =================================================
type OrderRowProps = { order: Order };
// =================================================

export default function OrderRow({ order }: OrderRowProps) {

  const totalPrice = order.items.reduce((acc, item) => {
    return acc + (item.mrp - item.off) * item.quantity;
  }, order.deliveryCharge);
  


  const getColor = (status: string) => {
    
    switch (status) {
      case "pending":
        return "secondary";
      case "Processing":
        return "secondary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "";
    }
  };

  return (
    <Link href={`/orders/${order.id}`}>
      <TableRow my="1rem" padding="6px 18px">
        <H5 m="6px" textAlign="left">
          #ORDER{order.id}
         
        </H5>

        <Box m="6px">
          <Chip p="0.25rem 1rem" bg={`${getColor(order.status)}.light`}>
            <Small color={`${getColor(order.status)}.main`}>{order.status.toLocaleUpperCase()}</Small>
          </Chip>
        </Box>

        <Typography className="flex-grow pre" m="6px" textAlign="left">
          {order.dateTime}
        </Typography>
        <Typography m="6px" textAlign="left">
         
         <span style={{marginLeft:20}}>{order.items.length}</span>
        
       </Typography>
        <Typography m="6px" textAlign="left">
         
          {currency((totalPrice))}
         
        </Typography>

      
        <Hidden flex="0 0 0 !important" down={769}>
          <Typography textAlign="center" color="text.muted">
            <IconButton>
              <Icon variant="small" defaultcolor="currentColor">
                arrow-right
              </Icon>
            </IconButton>
          </Typography>
        </Hidden>
      </TableRow>
    </Link>
  );
}
