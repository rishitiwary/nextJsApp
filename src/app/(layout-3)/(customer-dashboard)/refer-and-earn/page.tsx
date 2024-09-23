"use client";
import { Fragment, useEffect, useState,Suspense } from "react";
import { useRouter } from "next/navigation";
// API FUNCTIONS
import apiList from "@utils/__api__/apiList";
import axios from "axios";
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
import { colors } from "@utils/themeColors";
import Chart from "@component/chart";
import { Button, IconButton } from "@component/buttons";
import Icon from "@component/icon/Icon";
import Table from "@component/table";
import { margin, marginRight } from "styled-system";

type InfoItem = {
    title: string;
    imgs: string;
};

export default function ReferAndEarn() {
    const router = useRouter();
    const { state } = useAppContext();
    const token = tokens();
    const [userInfoResponse, setUserInfoResponse] = useState(null);
    const [referalPoinst, setReferalPoinst] = useState(null);
    const [loader, setLoader] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [friendPage, setFriendPage] = useState(1);
    const [type, setType] = useState('friend');
    const [transactionType, setTransactionType] = useState(null);

    const selectType = (type: string, transaction: string) => {
        setType(type);
        setTransactionType(transaction)
    }
    //fetch userinfo
    const handleFetchData = async () => {
        try {
            if (token) {
                const response = await axios({
                    url: `${apiList.USERINFO}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserInfoResponse(response.data);
                return response;
            }
        } catch (error) {
            console.log('Error in handleAddToCart:', error);
            throw error; // Re-throw to handle it in the calling function
        }
    }

    //end fetch user info

    //call api for referal points
    const handleReferalData = async () => {
        try {
            if (token) {
                const response = await axios({
                    url: `${apiList.REFERAL_POINT}?page=${currentPage}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setReferalPoinst(response.data);
                return response;
            }
        } catch (error) {
            console.log('Error in handleAddToCart:', error);
            throw error; // Re-throw to handle it in the calling function
        }
    }
    //end refral api
   

    useEffect(() => {
        handleFetchData();
        handleReferalData();
      
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (state.userData === null) {
                router.push("/login");
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [state.userData]);



    const infoList: InfoItem[] = [
        { title: "Wallet", imgs: "/assets/images/icons/Wallet Icon.svg" },
        { title: "Offers", imgs: "/assets/images/icons/Offer Icon.svg" },
        { title: "Payments", imgs: "/assets/images/icons/Payment Icon.svg" },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <Fragment>
            <DashboardPageHeader
                title="REFER AND EARN"
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
            {!!referalPoinst && referalPoinst.data ? <TableRow p="0.75rem 1.5rem">
                <FlexBox flexDirection="column" p="0.5rem"
                    backgroundColor={colors.blue}
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={10}
                >

                    <span>{referalPoinst.data.summary.credit.toFixed(2)}</span>
                </FlexBox>
                <FlexBox flexDirection="column" p="0.5rem"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Small color="text.muted" mb="4px">
                        -
                    </Small>

                </FlexBox>
                <FlexBox flexDirection="column" p="0.5rem"
                    backgroundColor={colors.primary.danger}
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={10}
                >

                    <span>{-referalPoinst.data.summary.debit.toFixed(2)}</span>
                </FlexBox>
                <FlexBox flexDirection="column" p="0.5rem"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Small color="text.muted" mb="4px">
                        =
                    </Small>

                </FlexBox>
                <FlexBox flexDirection="column" p="0.5rem"
                    backgroundColor={colors.success}
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={10}
                >

                    <span>{referalPoinst.data.summary.total.toFixed(2)}</span>
                </FlexBox>

            </TableRow> : null}


            <Box mb={30} mt={30}>
                <Grid container spacing={6}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {!!referalPoinst && referalPoinst.data.graphs ?
                            <FlexBox
                                as={Card}
                                p="14px 32px"
                                height="100%"
                                borderRadius={8}
                                alignItems="center"
                            >


                                <Chart data={referalPoinst.data.graphs} />
                            </FlexBox> : null}

                    </Grid>

                    {/* 
                    invit friends */}
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                    {!!referalPoinst && referalPoinst.data? <Table referalPoinst={referalPoinst} token={token} setLoader={setLoader} loader={loader}/>:<></>}
                
                    </Grid>
                </Grid>
            </Box>

        </Fragment>
        </Suspense>
    );
}
