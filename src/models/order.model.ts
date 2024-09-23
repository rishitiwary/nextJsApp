import User from "./user.model";

type Item = {
  off: any;
  mrp: any;
  number: any;
  product_img: string;
  product_name: string;
  product_price: number;
  quantity: number;
};

interface Order {
  deliveryCharge: number;
  dateTime: any;
  user: User;
  id: string;
  tax: number;
  items: Item[];
  createdAt: Date;
  discount: number;
  deliveredAt: Date;
  totalPrice: number;
  isDelivered: boolean;
  shippingAddress: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
}

export default Order;
