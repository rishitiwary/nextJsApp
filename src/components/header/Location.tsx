import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import { SemiSpan } from '@component/Typography';
import Container from '@component/Container';
import apiList from '@utils/__api__/apiList';
import useAxios from 'custom/useAxios';
import { geocode } from 'react-geocode';
import apiKeys from '@utils/__api__/apiKeys';
import FlexBox from '@component/FlexBox';
import SearchLocationInput from './SearchLoactionInput';
import Link from 'next/link';
import ChangeLocation from './ChangeLocation';
import Grid from '@component/grid/Grid';

const Location = () => {
  const { response: locationResponse, error: locationError, loading: locationLoading, fetchData: locationFetchData } = useAxios();
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: null,
    lng: null,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetch nearest store by latitude and longitude
  const fetchData = async () => {
    try {
      await locationFetchData({
        url: `${apiList.NEAREST_STORE}?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`,
        method: 'GET',
        data: null,
        params: null,
        headers: null,
      });
    } catch (error) {
      console.log('Error fetching inventory data:', error);
    }
  };

  // Get user's location
  const getLocation = async () => {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setSelectedLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
      }
    } catch (e) {
      console.log('Error getting location:', e);
    }
  };

  // Get address from lat, long
  const addByLangLat = async (lat, long) => {
    try {
      const response = await geocode('latlng', `${lat},${long}`, {
        key: apiKeys.PLACE_API,
        language: 'en',
      });
      setAddress(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedLocation.lat !== null && selectedLocation.lng !== null) {
      fetchData();
      addByLangLat(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation]);

  const url = `/address/create?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`;

  return (
    <>
      {/* Modal for location */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Body>
          <Container style={{  padding: '20px' }}>
            <SemiSpan style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Change Location</SemiSpan>

            <div className="row">
              <div className="col-lg-12">
                <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
                  <FontAwesomeIcon icon="fa-solid fa-location-dot" /> &nbsp;Please provide your delivery location to see products at the nearest store.
                </p>

                <div className="d-flex align-items-center justify-content-start">
                  <button className="btn btn-success btn-sm" onClick={getLocation} style={{ marginRight: '15px' }}>
                    Detect my location
                  </button>
                  <span style={{ margin: '0 10px', border: '1px solid black', borderRadius: '25px', padding: '5px 10px' }}>OR</span>
                  
                  <SearchLocationInput setSelectedLocation={setSelectedLocation} />
                </div>
              </div>

              <div className="col-lg-12 mt-4">
                {locationResponse && locationResponse.location === null ? (
                  <>
                    <FlexBox flex={1} justifyContent="center" m={20} fontSize={20} fontWeight="bold">
                      Oops
                    </FlexBox>
                    <p>Grozep is not available at <b>{address?.results[0]?.formatted_address}</b>. Please select a different location.</p>
                  </>
                ) : null}

                {locationResponse && locationResponse.location !== null ? (
                  <>
                    {localStorage.setItem('locationResponse', JSON.stringify(locationResponse))}
                    <p style={{ margin: '10px 0', fontSize: '16px' }}>
                      We can deliver your order in <b>{locationResponse.regularDurationMin}</b> minutes to your location.
                    </p>
                    <div className="mt-3">
                      <Link href={url}>
                        <button className="btn btn-success btn-sm" onClick={handleClose}>Edit address details</button>
                      </Link>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </Container>
        </Modal.Body>
      </Modal>

      <div className="col-lg-3 col-sm-12 col-md-4 col-xs-12" onClick={handleShow}>
        <ChangeLocation />
      </div>
    </>
  );
};

export default Location;
