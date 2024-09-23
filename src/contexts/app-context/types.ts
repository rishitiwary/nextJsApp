export interface ContextProps {
  state: InitialState;
  dispatch: (args: ActionType) => void;
}

export interface InitialState {
  userData: any;
  cart: CartItem[];
  isHeaderFixed: boolean;
}

export interface CartItem {
  qty: number;
  name: string;
  slug?: string;
  price: number;
  imgUrl?: string;
  id: string | number;
  productVariant:number;
  maxQuantity:number;
  limit:number;
  size:any;
  mrp:number;
  brand:string;
}

interface CartActionType {
  type: "CHANGE_CART_AMOUNT";
  payload: CartItem;
}

interface LayoutActionType {
  type: "TOGGLE_HEADER";
  payload: boolean;
}

interface UserData {
  type: "UPDATE_USER_DATA";
  payload: string;
}

interface ClearCart {
  type: "CLEAR_CART";
  payload: string;
}

interface UserDetails {
  type: "USER_DETAILS";
  payload: string;
}

interface InitialCart {
  type: "INITIALIZE_CART";
  payload: string;
}

export type ActionType = CartActionType | LayoutActionType | UserData | UserDetails | ClearCart | InitialCart;
