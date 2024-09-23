"use client"
import { Fragment, Suspense } from "react";
// GLOBAL CUSTOM COMPONENTS
import { Card1 } from "@component/Card1";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
// PAGE SECTION COMPONENTS
import { BackToAddress, AddressForm } from "@sections/customer-dashboard/address";
import { useSearchParams } from "next/navigation";

const CreateAddressContent = () => {
  const searchParams = useSearchParams();

  return (
    <Fragment>
      <DashboardPageHeader
        iconName="pin_filled"
        title="Add New Address"
        button={<BackToAddress />}
      />

      <Card1 borderRadius={8}>
        <AddressForm searchParams={searchParams} />
      </Card1>
    </Fragment>
  );
};

export default function CreateAddress() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAddressContent />
    </Suspense>
  );
}
