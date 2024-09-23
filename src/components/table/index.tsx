
import React, { Fragment, useEffect, useState, useRef,useCallback } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import axios from 'axios';
import apiList from '@utils/__api__/apiList';
import Spinner from '@component/Spinner';
import FlexBox from '@component/FlexBox';
import Grid from '@component/grid/Grid';
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import Typography, { H3, H5, Small } from "@component/Typography";
import { Button, IconButton } from "@component/buttons";
import StyledSearchBox from '@component/search-box/styled';
import TextField from '@component/text-field';
import Box from '@component/Box';
export default function Table({ loader, token, setLoader,referalPoinst }: any) {

    const [datas, setDatas] = useState<any[]>([]);
    const [pageNo, setPageNo] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null); // Reference to detect when user reaches bottom
    const [type, setType] = useState('friend');
    const [transactionType, setTransactionType] = useState(null);
    const [query, setQuery] = useState('');
    const selectType = (type: string, transaction: string) => {
        setType(type);
        setTransactionType(transaction);
        setQuery("");
        setPageNo(1);
    }
    const handleFriendsData = async (page: number) => {
        try {
            setIsLoading(true); // Loader for infinite scroll
            if (token) {
                const response = await axios({
                    url: `${apiList.FRIEND_LIST}?page=${page}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const newData = response.data.data;

                if (newData && newData.length > 0) {
                    setDatas((prevDatas) => {
                        const filteredData = newData.filter(
                            (item: any) => !prevDatas.some((prevItem) => prevItem.id === item.id)
                        );
                        return [...prevDatas, ...filteredData];
                    });
                } else {
                    setHasMoreData(false); // Stop further API calls if no data is returned
                }
            }
        } catch (error) {
            console.error('Error in handleFriendsData:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMultiData = async (page: number) => {
        try {
            setIsLoading(true);
            if (token) {
                const response = await axios({
                    url: `${apiList.MULTI_POINT}?page=${page}&source=${type}&type=${transactionType}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const newData = response.data.data.transaction;

                if (newData && newData.length > 0) {
                    setDatas((prevDatas) => {
                        const filteredData = newData.filter(
                            (item: any) => !prevDatas.some((prevItem) => prevItem.id === item.id)
                        );
                        return [...prevDatas, ...filteredData];
                    });
                } else {
                    setHasMoreData(false); // Stop further API calls if no data is found
                }
            }
        } catch (error) {
            console.error('Error in handleMultiData:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Clear data and reset page number when type or transactionType changes
        setDatas([]);
        setHasMoreData(true);
    }, [type, transactionType]);

    useEffect(() => {
        // Fetch initial data when type or transactionType changes
        if (type === 'friend') {
            handleFriendsData(pageNo);
        } else {
            handleMultiData(pageNo);
        }
    }, [pageNo,type]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMoreData) {
                    setPageNo((prevPageNo) => prevPageNo + 1); // Increment page number
                }
            },
            { threshold: 1.0 } // Trigger when the element is fully visible
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => {
            if (bottomRef.current) {
                observer.unobserve(bottomRef.current);
            }
        };
    }, [isLoading, hasMoreData]);
    const handleSearch = (event: any) => {
        setPageNo(1);
        setQuery(event.target.value);
    
      };
      useEffect(()=>{
      
       let urls=`${apiList.SEARCH_MUTLI_POINT}?page=${pageNo}&source=${type}&type=${transactionType}&q=${query}`;
       if(type=='friend'){
        urls=`${apiList.SEARCH_FRIEND}?q=${query}`;
       }
        const fetchSearchResults = async () => {
            try {
                const response = await axios({
                    url: urls,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    if(type=='friend'){
        setDatas(response.data.data);
    }else{
        setDatas(response.data.data.transaction);
    }
            
            } catch (error) {
                console.log('Error in fetching search results:', error);
            }
        };
    
        // Trigger the search only if query is not null or empty
        if (query) {
            fetchSearchResults();
        }
      },[query]);
      
     
    
    return (
        <Fragment>
            <Grid item lg={12} md={12} xs={12}>

                <FlexBox
                    as={Card}
                    p="14px 32px"
                    height="100%"
                    borderRadius={8}
                    alignItems="center"
                    justifyContent="space-between"
                >

                    <Typography>
                        Invite Friends
                    </Typography>
                    <Typography>
                    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>

        <TextField
          fullwidth
         onChange={handleSearch}
          className="search-field"
          placeholder="Search..."
          value={query}
      
        />

       
      </StyledSearchBox>

      
    </Box>

    </Typography>
                </FlexBox>



            </Grid>
            <Grid item lg={12} md={12} xs={12}>

            <FlexBox
                        as={Card}
                        p="14px 32px"
                        height="100%"
                        borderRadius={8}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Grid item lg={12} md={12} xs={12} justifyContent="center" alignContent="center">

                            <div style={{ display: 'flex', overflowX: 'auto', padding: '5px', whiteSpace: 'nowrap' }}>

                                <Grid item xs={6} lg={2} md={1} style={{ marginRight: '10px' }}>Friend List
                                    <Button className="btn btn-sm" height={15} color="primary" variant="outlined" onClick={() => selectType('friend',null)} >{referalPoinst.data.friendCount}</Button>
                                </Grid>
                                <Grid item xs={6} lg={2} md={1} style={{ marginRight: '10px' }}>Self

                                    <Button className="btn btn-sm" height={15} color="primary" variant="outlined" onClick={() => selectType('self', 'credited')} >{referalPoinst.data.earningPoint}</Button>
                                </Grid>

                                <Grid item xs={6} lg={2} md={1} style={{ marginRight: '10px' }}>Buddy

                                    <Button className="btn btn-sm" height={15} color="primary" variant="outlined" onClick={() => selectType('abc', 'credited')}>{referalPoinst.data.buddyPoint}</Button>
                                </Grid>
                                <Grid item xs={6} lg={2} md={1} style={{ marginRight: '10px' }}>Bonus

                                    <Button className="btn btn-sm" height={15} color="primary" variant="outlined" onClick={() => selectType('cab', 'credited')} >{referalPoinst.data.bonusPoint}</Button>
                                </Grid>
                                <Grid item xs={6} lg={2} md={1} style={{ marginRight: '10px' }}>Offer

                                    <Button className="btn btn-sm" height={15} color="primary" variant="outlined" onClick={() => selectType('offer', 'credited')} >{referalPoinst.data.offerPoint}</Button>
                                </Grid>

                                <Grid item xs={6} lg={2} md={1} style={{ marginRight: '10px' }}>Redeem

                                    <Button className="btn btn-sm" height={15} color="primary" variant="outlined" onClick={() => selectType('self', 'debited')}>{referalPoinst.data.redeemPoint}</Button>
                                </Grid>

                            </div>


                         

                     
            {!!datas && datas.length && type == 'friend' ? (
                <MDBTable responsive style={{ marginTop: '10px' }}>
                    <MDBTableHead light>
                        <tr style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                            <th scope="col">S.No</th>
                            <th scope="col">Name & Phone Number</th>
                            <th scope="col">Grade</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {datas.map((item: any, index: number) => (
                            <tr style={{ textAlign: 'center' }} key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                    {item.name}
                                    <br />
                                    {item.referredPhoneNumber}
                                </td>
                                <td>{item.grade}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            ) : (
                <MDBTable responsive style={{ marginTop: '10px' }}>
                    <MDBTableHead light>
                        <tr style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                            <th scope="col">S.No</th>
                            <th scope="col">Date</th>
                            {type == 'abc' ? <th scope="col">Name</th> : null}

                            <th scope="col">Points</th>
                            <th scope="col">Remarks</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>

                        {datas.map((item: any, index: number) => (
                            <tr style={{ textAlign: 'center' }} key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                    {item.createdAt}
                                </td>
                                {type == 'abc' ? <td>
                                    {item.name}
                                </td> : null}

                                <td>
                                    {item.amount?.toFixed(2)}
                                </td>
                                <td>#{item.orderInvoiceId}</td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            )}
{query==''?
<>
            {loader && (
                <FlexBox justifyContent="center">
                    <Spinner />
                </FlexBox>
            )}

            {isLoading && hasMoreData && (
                <FlexBox justifyContent="center">
                    <Spinner />
                </FlexBox>
            )}

            {hasMoreData && <div ref={bottomRef} style={{ height: '1px' }} />}
            </>
            
:null}
            </Grid>
            </FlexBox>
            </Grid>
        </Fragment>
    );
}
