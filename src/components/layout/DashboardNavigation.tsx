"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
// STYLED COMPONENTS
import { DashboardNavigationWrapper, StyledDashboardNav } from "./styles";

export default function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <DashboardNavigationWrapper px="0px" pb="1.5rem" color="gray.900" borderRadius={8}>
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p="26px 30px 1rem" color="text.muted" fontSize="12px">
            {item.title}
          </Typography>

          {item.list.map((item) => (
            <StyledDashboardNav
              px="1.5rem"
              mb="1.25rem"
              href={item.href}
              key={item.title}
              isCurrentPath={pathname.includes(item.href)}>
              <FlexBox alignItems="center">
                <div className="dashboard-nav-icon-holder">
                  <Icon variant="small" defaultcolor="currentColor" mr="10px">
                    {item.iconName}
                  </Icon>
                </div>

                <span>{item.title}</span>
              </FlexBox>

              <div className="dashboard-nav-icon-holder">
                  <Icon variant="small" defaultcolor="currentColor" mr="10px">
                    arrow-right
                  </Icon>
                </div>
            </StyledDashboardNav>
          ))}
        </Fragment>
      ))}
    </DashboardNavigationWrapper>
  );
}

const linkList = [
  {
    title: "DASHBOARD",
    list: [
      { href: "/orders", title: "Order History", iconName: "bag", },
      { href: "/address", title: "Address book", iconName: "pin"},
      // { href: "/wish-list", title: "Wishlist", iconName: "heart", count: 19 },
      // { href: "/support-tickets", title: "Support Tickets", iconName: "customer-service", count: 1 }
    
    ]
  },
  {
    title: "FEEDBACK & SHARE",
    list: [
      { href: "/refer-and-earn", title: "Refer & Earn", iconName: "credit-card" },
   
      { href: "/help-and-support", title: "Help & Support", iconName: "user"}
    ]
  },
  {
    title: "KNOW MORE",
    list: [
      { href: "/acount-privary", title: "Account privacy", iconName: "user"},
   
      { href: "/faq", title: "FAQs", iconName: "user" },
      { href: "/about-us", title: "About Us", iconName: "user" },
      { href: "/logout", title: "logout", iconName: "user" }
    ]
  }
];
