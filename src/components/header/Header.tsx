"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import Login from "@sections/auth/Login";

import Box from "@component/Box";
import Image from "@component/Image";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import MiniCart from "@component/mini-cart";
import Container from "@component/Container";
import { SemiSpan, Tiny } from "@component/Typography";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import Categories from "@component/categories/Categories";
import { SearchInputWithCategory } from "@component/search-box";
import { useAppContext } from "@context/app-context";
import StyledHeader from "./styles";
import UserLoginDialog from "./LoginDialog";
import Location from "./Location";
import useAxios from "custom/useAxios";
import apiList from "@utils/__api__/apiList";
import { defaultLocationResponse, tokens } from "@utils/utils";


// ====================================================================
type HeaderProps = { isFixed?: boolean; className?: string; fixed?: boolean; isMobile?: boolean };
// =====================================================================

export default function Header({ isFixed, className, fixed, isMobile }: HeaderProps) {

  const locationRes = defaultLocationResponse();

  const { state } = useAppContext();

  const [open, setOpen] = useState(false);
  const toggleSidenav = () => setOpen(!open);

  const CART_HANDLE = (
    <Box ml="20px" position="relative">
      <IconButton bg="gray.200" p="12px" size="small">
        <Icon size="20px">bag</Icon>
      </IconButton>

      {!!state.cart.length && (
        <FlexBox
          top={-5}
          right={-5}
          height={20}
          minWidth={20}
          bg="primary.main"
          borderRadius="50%"
          alignItems="center"
          position="absolute"
          justifyContent="center">
          <Tiny color="white" fontWeight="600" lineHeight={1}>
            {state.cart.length}
          </Tiny>
        </FlexBox>
      )}
    </Box>
  );

  const LOGIN_HANDLE = (
    <IconButton ml="1rem" bg="gray.200" p="8px">
      <Icon size="28px">user</Icon>
    </IconButton>
  );

  return (
    <StyledHeader className={className}>
      <Container display="flex" alignItems="center" justifyContent="space-between" height="100%">
        <FlexBox className="logo" alignItems="center" mr="1rem">
          <Link href="/">
            <Image src="/assets/images/logo.png" height={50} width={100} alt="logo" />
          </Link>

          {isFixed && (
            <div className="category-holder">
              <Categories>
                <FlexBox color="text.hint" alignItems="center" ml="1rem">
                  <Icon>categories</Icon>
                  <Icon>arrow-down-filled</Icon>
                </FlexBox>
              </Categories>
            </div>
          )}
        </FlexBox>

        <div className="container mt-3">

          <div className="row">
            {isMobile ? <>{fixed ? null : <Location />}</> : <Location />}


            <div className="col-lg-8 col-sm-12 col-md-8 col-xs-12">

              <FlexBox justifyContent="center" flex="1 1 0">

                <SearchInputWithCategory />
              </FlexBox>
            </div>
          </div>
        </div>


        <FlexBox className="header-right" alignItems="center">
          {state.userData !== null ? <><Link href="/profile">
            {LOGIN_HANDLE}
          </Link></> : <UserLoginDialog handle={LOGIN_HANDLE}>
            <div>
              <Login />
            </div>
          </UserLoginDialog>}
          <Sidenav
            open={open}
            width={380}
            position="right"
            handle={CART_HANDLE}
            toggleSidenav={toggleSidenav}>
            <MiniCart toggleSidenav={toggleSidenav} />
          </Sidenav>
        </FlexBox>
      </Container>
    </StyledHeader>
  );
}
