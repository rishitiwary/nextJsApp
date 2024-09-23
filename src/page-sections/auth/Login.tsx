"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button, IconButton } from "@component/buttons";
import { H3, H5, H6, SemiSpan, Small, Span } from "@component/Typography";
import useAxios from "custom/useAxios";
import apiList from "@utils/__api__/apiList";
import OtpInput from 'react-otp-input';
import secureLocalStorage from "react-secure-storage";
// STYLED COMPONENT
import { StyledRoot } from "./styles";
import { useEffect, useState } from "react";
import { useAppContext } from "@context/app-context";


export default function Login() {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [otp, setOtp] = useState('');
  // const { passwordVisibility, togglePasswordVisibility } = useVisibility();
  const [defaultAddress, setAddress] = useState([]);
  const [storeCode, setStoreCode] = useState('');
  const [token, setToken] = useState('');

  const { response: cartResponse, error: cartError, loading: cartLoading, fetchData: cartData } = useAxios();
  const { response: locationResponse, error: locationError, loading: locationLoading, fetchData: locationFetchData } = useAxios();
  const { response: userInfoResponse, error: userInfoError, loading: userInfoLoading, fetchData: userInfoData } = useAxios();
  const { response: loginResponse, error: loginError, loading: loginLoading, fetchData: loginFetchData } = useAxios();
  const { response: otpVerificationResponse, error: otpVerificationError, loading: otpVerificationLoading, fetchData: otpVerificationFetchData } = useAxios();

  const initialValues = { number: "", deviceType: "web" };

  const formSchema = yup.object().shape({
    number: yup.string().required("${path} is required").matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
  });

  // useEffect(() => {
  //   if (state.userData !== null) {
  //     router.push('/profile');
  //   }
  // }, []);

  const handleFormSubmit = async (values: any) => {

    try {
      const datas = {
        "number": values.number,
        "deviceType": values.deviceType
      }
      // Call API for product by category
      await loginFetchData({ url: apiList.LOGIN_WITH_PHONE, method: "POST", data: datas, params: null, headers: null });
    } catch (error) {
      console.log("Error fetching  data:", error);
    }

  };
  const handleVerify = async () => {
    values.code = parseInt(otp);
    try {
      const datas = values;
      // Call API for otp verification
      await otpVerificationFetchData({ url: apiList.OTP_VERIFICATION, method: "POST", data: datas, params: null, headers: null });
    } catch (error) {
      console.log("Error fetching  data:", error);
    }
  }
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema
  });




  const findNearestStore = async (defaultAddress) => {
    try {
      await locationFetchData({ url: apiList.NEAREST_STORE + `?lat=${defaultAddress.latitude}&lng=${defaultAddress.longitude}`, method: "GET", data: null, params: null, headers: null });

    } catch (error) {
      console.log("Error fetching inventory data:", error);
    }
  };
  //end find nearest store




  //set userinfo
  const handleFetchData = async (token: any) => {
    try {
      // Call API for user details
      await userInfoData({
        url: apiList.USERINFO, method: "GET", data: {}, params: null, headers: {
          Authorization: 'Bearer ' + otpVerificationResponse.token,
        }
      });

    } catch (error) {
      console.log("Error fetching  data:", error);
    }
  };
  //end
  //fetching cart data

  useEffect(() => {
    const handleAddToCart = async () => {
      if (token && storeCode) {
        try {
          await cartData({
            url: apiList.SHOPING_BAG,
            method: 'GET',
            data: {},
            params: null,
            headers: {
              Authorization: `Bearer ${token}`,
              storecode: storeCode
            }
          });
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      }
    };

    handleAddToCart();
  }, [token, storeCode]);

  useEffect(() => {
    if (cartResponse && cartResponse.data) {
      localStorage.setItem('cart', JSON.stringify(cartResponse));
    }
  }, [cartResponse]);
  //end fetching cart data
  useEffect(() => {
    if (otpVerificationResponse?.status) {
      localStorage.setItem("userData", JSON.stringify(otpVerificationResponse));
      setToken(otpVerificationResponse.token);
      handleFetchData(otpVerificationResponse.token);
    }
  }, [otpVerificationResponse]);

  useEffect(() => {
    if (userInfoResponse?.status) {

      localStorage.setItem("userInfo", JSON.stringify(userInfoResponse));
      const defaultAddress = userInfoResponse.data.addresses.find((ad: any) => ad.isDefault);
      setAddress(defaultAddress ? [defaultAddress] : []);
      findNearestStore(defaultAddress);
      window.location.replace('/');
    }
  }, [userInfoResponse]);

  //find nearest store
  useEffect(() => {
    locationResponse ? localStorage.setItem('locationResponse', JSON.stringify(locationResponse)) : '';
    setStoreCode(locationResponse && locationResponse.storecode);
  }, [locationResponse]);



  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <Box>
        <form className="content" onSubmit={handleSubmit}>
          <H3 textAlign="center" mb="0.5rem">
            Welcome To Grozep

          </H3>

          <H5 fontWeight="600" fontSize="12px" color="gray.800" textAlign="center" mb="2.25rem">
            Log in with mobile number
          </H5>

          <h4 style={{ textTransform: 'capitalize' }}>
            {otpVerificationResponse !== null && otpVerificationResponse.status === false ? otpVerificationResponse.error.message : loginResponse !== null ? loginResponse.message : ''}



          </h4>
          {(loginResponse !== null && loginResponse.status) ? <>
            {/* enter otp form */}
            <FlexBox justifyContent="center" bg="gray.200" py="19px">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span> </span>}
                inputType="tel"
                containerStyle={{ display: 'unset' }}
                inputStyle={{ width: "3rem", height: "3.5rem", borderRadius: '10px', border: '1px solid black', margin: '2px' }}
                renderInput={(props) => <input {...props} className='otp-input' />}
              />

            </FlexBox>
            <Button mb="1.65rem" variant="contained" color="success" type="button" onClick={handleVerify} fullwidth>
              Verify OTP
            </Button>
          </> : <>
            {/* enter mobile number */}

            <TextField
              fullwidth
              mb="0.75rem"
              name="number"
              type="text"
              onBlur={handleBlur}
              value={values.number}
              onChange={handleChange}
              placeholder="91XXXXXXXX"
              label="Phone Number"
              errorText={touched.number && errors.number}
            />

            <Button mb="1.65rem" variant="contained" color="primary" type="submit" fullwidth>
              Login with phone
            </Button>
          </>
          }


        </form>

        <FlexBox justifyContent="center" bg="gray.200" py="19px">
          <Link href="/">
            <SemiSpan>Agree to our term & conditions policies.</SemiSpan>

            {/* <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
            Reset It
          </H6> */}
          </Link>
        </FlexBox>
      </Box>
    </StyledRoot>
  );
}
