"use client";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
// API FUNCTIONS
import apiList from "@utils/__api__/apiList";
import useAxios from "custom/useAxios";
import { tokens } from "@utils/utils";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Card from "@component/Card";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Typography, { H3, H5, Small } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { useAppContext } from "@context/app-context";

type UserInfoResponse = {
  data: {
    user: {
      name: string;
      point: number;
      grade: string;
      gst: string;
      phone: string;
    };
  };
};

type InfoItem = {
  title: string;
  imgs: string;
};

export default function Profile() {
  const router = useRouter();
  const { state } = useAppContext();
  const token = tokens();
  const {
    response: userInfoResponse,
    error: userInfoError,
    loading: userInfoLoading,
    fetchData: userInfoData,
  } = useAxios();

  const handleFetchData = async () => {
    try {
      // Call API for user details
      await userInfoData({
        url: apiList.USERINFO,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (state.userData === null) {
      router.push("/login");
    }
    handleFetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.userData === null) {
        router.push("/login");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [state.userData]);

  if (userInfoLoading) return <div>Loading...</div>;

  const infoList: InfoItem[] = [
    { title: "Wallet", imgs: "/assets/images/icons/Wallet Icon.svg" },
    { title: "Offers", imgs: "/assets/images/icons/Offer Icon.svg" },
    { title: "Payments", imgs: "/assets/images/icons/Payment Icon.svg" },
  ];

  return (
    <Fragment>
      <DashboardPageHeader
        title="My Profile"
        iconName="user_filled"
      // button={<EditProfileButton />}
      />

      <Box mb="30px">
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <FlexBox
              as={Card}
              p="14px 32px"
              height="100%"
              borderRadius={8}
              alignItems="center"
            >
              <Avatar src="/assets/images/icons/user_filled.svg" size={64} />

              <Box ml="12px" flex="1 1 0">
                <FlexBox
                  flexWrap="wrap"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>
                    <H5 my="0px">{userInfoResponse?.data.user.name}</H5>

                    <FlexBox alignItems="center">
                      <Typography fontSize="14px" color="text.hint">
                        POINT:
                      </Typography>

                      <Typography ml="4px" fontSize="14px" color="primary.main">
                        {userInfoResponse?.data.user.point.toFixed(2)}
                      </Typography>
                    </FlexBox>
                  </div>

                  <Typography
                    fontSize="14px"
                    color="text.hint"
                    letterSpacing="0.2em"
                  >
                    GRADE: {userInfoResponse?.data.user.grade}
                  </Typography>
                </FlexBox>
              </Box>
            </FlexBox>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Grid container spacing={4}>
              {infoList.map((item) => (
                <Grid item lg={4} sm={6} xs={6} key={item.title}>
                  <FlexBox
                    as={Card}
                    height="100%"
                    p="1rem 1.25rem"
                    borderRadius={8}
                    alignItems="center"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Small color="text.muted" textAlign="center">
                      <img src={item.imgs} alt={item.title} />
                    </Small>
                    <H3 color="primary.default" my="5px" fontWeight="600">
                      {item.title}
                    </H3>
                  </FlexBox>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <TableRow p="0.75rem 1.5rem">
        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            Name
          </Small>
          <span>{userInfoResponse?.data.user.name}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            GST No
          </Small>
          <span>{userInfoResponse?.data.user.gst}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            Email
          </Small>
          <span>{userInfoResponse?.data.user.name}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px" textAlign="left">
            Phone
          </Small>
          <span>{userInfoResponse?.data.user.phone}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            Grade
          </Small>
          <span>{userInfoResponse?.data.user.grade}</span>
        </FlexBox>
      </TableRow>
    </Fragment>
  );
}
