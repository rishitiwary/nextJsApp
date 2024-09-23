"use client";
import { useState, useEffect, useMemo } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import { SearchParams } from "interfaces";
import { geocode, RequestType } from "react-geocode";
import apiKeys from '@utils/__api__/apiKeys';
import apiList from "@utils/__api__/apiList";
import useAxios from "custom/useAxios";
import { tokens } from "@utils/utils";
import { useRouter } from "next/navigation";
// ===========================================================
type AddressFormProps = { searchParams?: SearchParams, address?: any };
// ===========================================================

export default function AddressForm({ searchParams }: AddressFormProps) {
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const router = useRouter();
  const token = tokens();
  let lat: any = '';
  let lng: any = '';
  const { response: locationResponse, error: locationError, loading: locationLoading, fetchData: locationFetchData } = useAxios();
  const { response: cartResponse, error: cartError, loading: cartLoading, fetchData: cartData } = useAxios();
  const { response: addressResponse, error: addresError, loading: addressLoading, fetchData: addessAddData } = useAxios();

  const [address, setAddress] = useState({
    country: null,
    state: null,
    city: null,
    pinCode: null,
  });
  const [label, setLabel] = useState('Home');
  // Get formatted address, city, state, country from latitude & longitude.
  const addByLangLat = async (lat, long) => {
    geocode(RequestType.LATLNG, `${lat},${long}`, {
      key: apiKeys.GOOGLE_API_KEY,
    })
      .then(({ results }) => {
        const { city, state, country, postal_code } = results[0].address_components.reduce(
          (acc, component) => {
            if (component.types.includes("locality")) acc.city = component.long_name;
            else if (component.types.includes("administrative_area_level_1")) acc.state = component.long_name;
            else if (component.types.includes("country")) acc.country = component.long_name;
            else if (component.types.includes("postal_code")) acc.postal_code = component.long_name;
            return acc;
          },
          {}
        );
        setAddress({
          country: country,
          state: state,
          city: city,
          pinCode: postal_code,
        });
      })
      .catch(console.error);
  };



  const INITIAL_VALUES = useMemo(() => ({
    label: label,
    receiverName: "",
    phoneAlt: "",
    locality: "",
    nearby: "",
    floorNo: "",
    address: "",
    pinCode: address.pinCode,
    district: address.city,
    state: address.state,
    addressId: "",
    latitude: lat,
    longitude: lng,
    isDefault: true,
  }), [address, lat, lng]);

  const VALIDATION_SCHEMA = yup.object().shape({
    receiverName: yup.string().required("required"),
    address: yup.string().required("required"),
    phoneAlt: yup.string().matches(phoneRegExp, 'Phone number is not valid')
      .min(10, "Mobile number should be 10 digits")
      .max(10, "Mobile number should be 10 digits"),

  });

  //empty cart
  const handleAddToCart = async () => {
    if (token) {
      try {
        await cartData({
          url: apiList.SHOPING_BAG,
          method: 'DELETE',
          data: {},
          params: null,
          headers: {
            Authorization: `Bearer ${token}`,

          }
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };


  //end funtion of empty cart
  const handleFormSubmit = async (values: any) => {
    findNearestStore(lat, lng);
    handleAddToCart();
    localStorage.removeItem('cart');
    localStorage.removeItem('locationResponse');
    try {
      const datas = {
        label: label,
        receiverName: values.receiverName,
        phoneAlt: values.phoneAlt,
        locality: "",
        nearby: values.nearby,
        floorNo: values.floorNo,
        address: values.address,
        pinCode: address.pinCode,
        district: address.city,
        state: address.state,
        addressId: "",
        latitude: lat,
        longitude: lng,
        isDefault: true,
      }

      // Call API for add address
      await addessAddData({
        url: apiList.ADDRESS, method: "POST", data: datas, params: null, headers: {
          Authorization: 'Bearer ' + token,
        }
      });
      window.location.reload();
    } catch (error) {
      console.log("Error fetching  data:", error);
    }
  };

  const updateLabel = (value: any, setFieldValue: any) => {
    setLabel(value);
    setFieldValue("label", value);
  };

  if (addressResponse && addressResponse.status) {
    router.push('/address');
  }


  if (searchParams.get('lat') !== null && searchParams.get('lng') !== null) {
    lat = searchParams.get('lat');
    lng = searchParams.get('lng');
    localStorage.setItem('lat', lat);
    localStorage.setItem('lng', lng);
  } else {
    lat = localStorage.getItem('lat');
    lng = localStorage.getItem('lng');

  }
  //find nearest store
  const findNearestStore = async (lat, lng) => {
    try {
      await locationFetchData({ url: apiList.NEAREST_STORE + `?lat=${lat}&lng=${lng}`, method: "GET", data: null, params: null, headers: null });

    } catch (error) {
      console.log("Error fetching inventory data:", error);
    }
  };
  //end find nearest store
  useEffect(() => {
    if (lat && lng) {
      addByLangLat(lat, lng);
    }
  }, [lat, lng]);
  useEffect(() => {
    locationResponse ? localStorage.setItem('locationResponse', JSON.stringify(locationResponse)) : '';
  }, [locationResponse]);

  return (
    <Formik
      enableReinitialize
      initialValues={INITIAL_VALUES}
      validationSchema={VALIDATION_SCHEMA}
      onSubmit={handleFormSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Box mb="30px">
            <Grid container horizontal_spacing={10} vertical_spacing={10}>
              <Grid item md={1} xs={2}>
                <button
                  type="button"
                  className={values.label === 'Home' ? "btn btn-success btn-sm" : 'btn btn-light btn-sm'}
                  onClick={() => updateLabel('Home', setFieldValue)}
                >
                  Home
                </button>
              </Grid>
              <Grid item md={1} xs={2}>
                <button
                  type="button"
                  className={values.label === 'Work' ? "btn btn-success btn-sm" : 'btn btn-light btn-sm'}
                  onClick={() => updateLabel('Work', setFieldValue)}
                >
                  Work
                </button>
              </Grid>
              <Grid item md={1} xs={2}>
                <button
                  type="button"
                  className={values.label === 'Hotel' ? "btn btn-success btn-sm" : 'btn btn-light btn-sm'}
                  onClick={() => updateLabel('Hotel', setFieldValue)}
                >
                  Hotel
                </button>
              </Grid>
              <Grid item md={1} xs={2}>
                <button
                  type="button"
                  className={values.label === 'Other' ? "btn btn-success btn-sm" : 'btn btn-light btn-sm'}
                  onClick={() => updateLabel('Other', setFieldValue)}
                >
                  Other
                </button>
              </Grid>
            </Grid>
            <hr />
            <Grid container horizontal_spacing={6} vertical_spacing={4}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="receiverName"
                  label="Receiver's name*"
                  onBlur={handleBlur}
                  value={values.receiverName}
                  onChange={handleChange}
                  errorText={touched.receiverName && errors.receiverName}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="address"
                  label="Complete address*"
                  onBlur={handleBlur}
                  value={values.address}
                  onChange={handleChange}
                  errorText={touched.address && errors.address}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  label="Alternative number (optional)"
                  name="phoneAlt"
                  onBlur={handleBlur}
                  value={values.phoneAlt}
                  onChange={handleChange}
                  errorText={touched.phoneAlt && errors.phoneAlt}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="floorNo"
                  label="Floor no (optional)"
                  onBlur={handleBlur}
                  value={values.floorNo}
                  onChange={handleChange}
                  errorText={touched.floorNo && errors.floorNo}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="nearby"
                  label="Nearby (optional)"
                  onBlur={handleBlur}
                  value={values.nearby}
                  onChange={handleChange}
                  errorText={touched.nearby && errors.nearby}
                />
              </Grid>
            </Grid>
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </form>
      )}
    </Formik>
  );
}
