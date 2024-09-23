"use client";

import { useEffect, useState } from "react";
import Menu from "../Menu";
import Image from "../Image";
import Icon from "../icon/Icon";
import FlexBox from "../FlexBox";
import NavLink from "../nav-link";
import MenuItem from "../MenuItem";
import Container from "../Container";
import { Small } from "../Typography";
import StyledTopbar from "./styles";

export default function Topbar() {


  return (
    <StyledTopbar>
      <Container display="flex" justifyContent="space-between" alignItems="center" height="100%">
        <FlexBox className="topbar-left">
          <div className="logo">
            <img src="/assets/images/icons/logowhite.svg" alt="logo" />
            
          </div>

          <FlexBox alignItems="center">
            <Icon size="14px">phone-call</Icon>
            <span>+91 8448444943</span>
          </FlexBox>

          <FlexBox alignItems="center" ml="20px">
            <Icon size="14px">mail</Icon>
            <span>contactus@grozep.com</span>
          </FlexBox>
        </FlexBox>

        <FlexBox className="topbar-right" alignItems="center">
          <NavLink className="link" href="/">
            Need Help?
          </NavLink>
        </FlexBox>
      </Container>
    </StyledTopbar>
  );
}

 
