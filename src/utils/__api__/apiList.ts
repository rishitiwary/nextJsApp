import { baseUrl } from "config/default";

const apiList = {
    HOME: baseUrl,
    HOME_MENU:`${baseUrl}/v1/home`,
    HOME_MORE_FOR_YOU:`${baseUrl}/v1/products/viewmore`,
    TOP_RATED_PRODUCTS:`${baseUrl}/v1/products/toprated`,
    TOP_BRANDS:`${baseUrl}/v1/in/brands`,
    PRODUCT_DETAILS:`${baseUrl}/v1/productdetails/`,
    PRODUCT_BY_CATEGORY:`${baseUrl}/v1/products?page=`,
    PRODUCT_BY_SUB_CATEGORY:`${baseUrl}/v1/products`,
    LOGIN_WITH_PHONE:`${baseUrl}/login/v1/phone`,
    OTP_VERIFICATION:`${baseUrl}/login/v1/phone-verification`,
    VALIDATE_NEW_USER:`${baseUrl}/v1/referal/user`,
    VALIDATE_NEW_USER_CODE:`${baseUrl}/v1/referal/code`,
    NEAREST_STORE:`${baseUrl}/v1/stores`,
    ADDRESS:`${baseUrl}/v1/users/addresses`,
    ORDERS:`${baseUrl}/v1/orders?page`,
    USERINFO:`${baseUrl}/v1/users`,
    SHOPING_BAG:`${baseUrl}/v1/shopping-bags`,
    WALLET:`${baseUrl}/v1/wallets`,
    COUPONS:`${baseUrl}/v2/coupons`,
    VALIDATE_COUPON:`${baseUrl}/v1/coupons/validate`,
    PLACE_ORDER:`${baseUrl}/v1/orders`,
    GLOBAL_SEARCH:`${baseUrl}/v1/search`,
    PRODUCT_MIX:`${baseUrl}/v1/products-mix`,
    TRACK_ORDER:`${baseUrl}/v1/orders`,
    REFERAL_POINT:`${baseUrl}/v1/referral-points`,
    FRIEND_LIST:`${baseUrl}/v1/referal/registration`,
    MULTI_POINT:`${baseUrl}/v1/multi-points`,
    SEARCH_MUTLI_POINT:`${baseUrl}/v1/multi-points/search`,
    SEARCH_FRIEND:`${baseUrl}/v1/referal/registration/search`,
    DYNAMIC_PAGES:`${baseUrl}/v1/in/pages/`,

    // EMP_OTP_VERIFICATION: `${baseUrl}/v1/employee/login/phone-verification`,
    // EMP_DETAILS:`${baseUrl}/v1/in/employees`,
    // INVENTORY_LIST:`${baseUrl}/v1/in/inventory`,
    // STORE_LIST:`${baseUrl}/v1/in/stores`
};

export default apiList;



