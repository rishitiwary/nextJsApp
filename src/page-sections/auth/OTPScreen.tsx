import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

export default function OTPScreen() {
  const [otp, setOtp] = useState('');

  return (
    <OtpInput
    value={otp}
    onChange={setOtp}
    numInputs={6}
    renderSeparator={<span> </span>}
    inputType="tel"
    containerStyle={{ display: 'unset' }}
    inputStyle={{ width: "3rem", height: "3.5rem" }}
    renderInput={(props) => <input {...props} className='otp-input' />}
  />
  );
}