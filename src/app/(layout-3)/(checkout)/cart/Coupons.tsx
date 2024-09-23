"use client"
import React, { useEffect, useState } from "react";
import Grid from "@component/grid/Grid";
import { Card1 } from "@component/Card1";
import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
import Divider from "@component/Divider";
import { Button } from "@component/buttons";
import { currency } from "@utils/utils";
import apiList from "@utils/__api__/apiList";
import axios from "axios";
const CouponsComp = ({ uniqueCoupons, allCoupons, token, grandTotal, setPromoDiscount, setGrandTotal, setFilterCoupons, setActiveCoupon, setAppliedCoupons, setApplicableCouponAmount, applicableCouponAmount, appliedCoupons, activeCoupon, filterCoupons,setMessageData,applyBP }) => {

    
    useEffect(() => {
        if(applicableCouponAmount==0 || applicableCouponAmount==false){
            setApplicableCouponAmount(!!allCoupons && (grandTotal - (grandTotal * allCoupons.allowedPercent / 100)))
        }
    }, []);

    const filterData = (code: any) => {
        setActiveCoupon(code);
        const filterCoupon = allCoupons.data.filter(datas => datas.code === code);
        setFilterCoupons(filterCoupon);
    }

    const applyCoupon = async (code: string, value: number, id: number,origin:string) => {
        if (value < applicableCouponAmount-applyBP) {
            try {
                const response = await axios({
                    url: apiList.VALIDATE_COUPON + "?code=" + code,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status) {
                    setApplicableCouponAmount(applicableCouponAmount - value);
                    setGrandTotal(grandTotal - value);
                    let obj: any = {
                        'code': code, 'value': value, 'id': id,'origin':origin
                    }
                    setAppliedCoupons([...appliedCoupons, obj]);
                    setMessageData({ 'status': true, 'type': 'success','message':'The voucher succesfully applied.' });
                }

            } catch (error) {
                console.log(error);
            }
        } else {
            setMessageData({ 'status': true, 'type': 'error','message':'This voucher can not be applied on this order.' });
        }


    }

    const removeCoupon = async (code: string, value: number, id: number,origin:string) => {
        setApplicableCouponAmount(applicableCouponAmount + value);
        setGrandTotal(grandTotal + value);
        appliedCoupons = appliedCoupons.filter(obj => !(obj.code === code && obj.id === id));
        setAppliedCoupons(appliedCoupons);

    }
    useEffect(() => {
        const promoAmounts = appliedCoupons && appliedCoupons.reduce((acc, promo) => {
            return acc + promo.value;
        }, 0);
        setPromoDiscount(promoAmounts);

    }, [appliedCoupons]);


    return (
        <>
            <Grid item lg={12} md={12} xs={12}>

                {!!uniqueCoupons && uniqueCoupons.map((item, index) => {
                   
                    return (
                        <Card1 borderRadius={10} key={index}
                            border="1px dashed #7D879C"
                            borderColor='#7D879C'
                            m={3}
                        >
                            <FlexBox alignItems="center"
                                justifyContent="flex-start"
                                mt={-10}
                            >
                                <Typography fontWeight="600" fontSize={18} style={{ textTransform: 'capitalize' }} >
                                    {item.label} ({item.code})

                                </Typography>

                                <Typography fontWeight={600} fontSize={15} paddingLeft={10}> {item.issuedDate} </Typography>

                            </FlexBox>

                            <Divider mt={10} />
                            <FlexBox alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography fontWeight="600" fontSize={14} mt={2} color='#00000080'>
                                    Details
                                    <ul style={{
                                        fontSize: '12px', marginTop: '10px', color: '#00000080'
                                    }}>
                                        <li>{item.description}</li>
                                        <li>You recieved {item.totalCoupons} coupons upon joining.</li>
                                        <li>Each Coupon is worth {item.value}</li>
                                        <li>So far, {item.totalCoupons - item.availableCoupons} coupons have been used</li>
                                    </ul>
                                </Typography>

                                <Typography fontWeight="600" fontSize={30} ml={10} color='#16B061'>
                                    {item.applicableCoupons}
                                </Typography>
                                <Typography fontWeight="600" fontSize={14} ml={10} color='#16B061'>
                                    Today redeem
                                </Typography>
                            </FlexBox>
                            <Divider mb={20} />
                            <FlexBox alignItems="center"
                                justifyContent="space-between"
                                backgroundColor="#16B061"

                                borderRadius={15}
                                minHeight="50px"
                                width="auto"
                                color="#ffffff"
                                style={{ textTransform: 'capitalize' }}

                            >
                                <Typography fontWeight="600" fontSize={14} p={10}  >
                                    {item.applicableCoupons} Remaining {item.applicableCoupons === 1 ? 'coupon' : 'coupons'}
                                </Typography>
                                <Typography p={10}>
                                    {item.code === activeCoupon ? <Button variant="outlined" color="white" fullwidth borderRadius={30} height={30} onClick={() => filterData(0)}>
                                        Hide
                                    </Button> : <Button variant="outlined" color="white" fullwidth borderRadius={30} height={30} onClick={() => filterData(item.code)}>
                                        View All
                                    </Button>}

                                </Typography>
                            </FlexBox>


                            {
                                activeCoupon === item.code ? (!!filterCoupons && filterCoupons.map((item, index) => {
                                    return (
                                        <Card1 borderRadius={10} key={index}
                                            border="1px dashed #7D879C"
                                            borderColor='#7D879C'
                                            m={3}>
                                            <FlexBox
                                                mt={-10}
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Typography fontWeight="600" fontSize={18} style={{ textTransform: 'capitalize' }} >
                                                    {item.label}


                                                </Typography>

                                                <Typography>
                                                    VOUCHER
                                                </Typography>

                                            </FlexBox>

                                            <Divider mt={10} />
                                            <FlexBox alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Typography fontWeight="600" fontSize={14} mt={2} color='#00000080'>

                                                    <p style={{
                                                        fontSize: '12px', marginTop: '10px', color: '#00000080'
                                                    }}>
                                                        {item.description}

                                                    </p>
                                                </Typography>

                                                <Typography fontWeight="600" fontSize={20} ml={10} color='#16B061'>
                                                    {currency(item.value)}
                                                </Typography>
                                                <Typography fontWeight="600" fontSize={14} ml={10} color='#16B061'>
                                                    Off
                                                </Typography>
                                            </FlexBox>

                                            <Divider />
                                            <FlexBox
                                                marginTop={10}
                                                marginBottom={-10}
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography fontWeight="500" fontSize={12}>
                                                    SERIAL NUMBER <br /> {item.code}
                                                </Typography>
                                                <Typography>
                                                  
                                                    {
                                                        !!appliedCoupons && appliedCoupons.some(items => (items.id === item.id && items.code === item.code)) ? 
                                                        <>
                                                        <Button variant="outlined" color="primary" fullwidth borderRadius={30} height={30} onClick={() => removeCoupon(item.code, item.value, item.id,item.origin)}>
                                                            Remove
                                                        </Button> 
                                          
                                                        </>: 
                                                        <Button variant="outlined" color="success" fullwidth borderRadius={30} height={30} onClick={() => applyCoupon(item.code, item.value, item.id,item.origin)}>
                                                            Apply now
                                                        </Button>
                                                    }



                                                </Typography>
                                            </FlexBox>

                                        </Card1>
                                    )
                                })) : ''

                            }
                        </Card1 >
                    )
                })}
            </Grid >
        </>
    )
}

export default CouponsComp;