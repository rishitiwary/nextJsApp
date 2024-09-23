import type MockAdapter from "axios-mock-adapter";

import { market1ApiEndpoints } from "./__db__/market-1";



import { relatedProductsApiEndpoints } from "./__db__/related-products";



import { shopApiEndpoints } from "./__db__/shop";
import { salesApiEndpoints } from "./__db__/sales";
import { adminApiEndpoints } from "./__db__/users";
import { orderApiEndpoints } from "./__db__/orders";
import { ticketApiEndpoints } from "./__db__/ticket";
import { AddressApiEndPoints } from "./__db__/address";
import { productApiEndpoints } from "./__db__/products";
import { dashboardApiEndpoints } from "./__db__/dashboard";

export const MockEndPoints = (Mock: MockAdapter) => {
  market1ApiEndpoints(Mock);
  relatedProductsApiEndpoints(Mock);
  shopApiEndpoints(Mock);
  salesApiEndpoints(Mock);
  adminApiEndpoints(Mock);
  orderApiEndpoints(Mock);
  ticketApiEndpoints(Mock);
  AddressApiEndPoints(Mock);
  productApiEndpoints(Mock);
  dashboardApiEndpoints(Mock);

  Mock.onAny().passThrough();
};
