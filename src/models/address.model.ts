import User from "./user.model";

interface Address {
  isDefault: any;
  phoneAlt: any;
  label: any;
  district: any;
  pinCode: any;
  address: any;
  id: string;
  user: User;
  city: string;
  title: string;
  phone: string;
  street: string;
  country: string;

}

export default Address;
