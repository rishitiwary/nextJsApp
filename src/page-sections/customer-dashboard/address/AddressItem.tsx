"use client";

import Link from "next/link";

import Icon from "@component/icon/Icon";
import TableRow from "@component/TableRow";
import Typography, { SemiSpan } from "@component/Typography";
import { IconButton } from "@component/buttons";
import Address from "@models/address.model";

interface AddressItemProps {
  item: Address;
  deleteAddress: any;
}
export default function AddressItem({ item, deleteAddress }: AddressItemProps) {

  const deleAdd = (id) => {
    deleteAddress(id);
  }
  return (
    <TableRow my="1rem" padding="6px 18px" key={item.id} >
      <Typography className="pre" m="6px" textAlign="left">
        {item.label}
        {item.isDefault ?
          <span class="badge text-bg-success" style={{ marginLeft: '2px' }}>Default</span>
          : ''}
      </Typography>

      <Typography flex="1 1 260px !important" m="6px" textAlign="left">
        {`${item.address}, ${item.district}, ${item.pinCode}`}
      </Typography>

      <Typography className="pre" m="6px" textAlign="left">
        {item.phoneAlt}

      </Typography>

      <Typography className="pre" textAlign="center" color="text.muted">

        {/* <Link href={`/address/${item.id}`}>
  <IconButton>
    <Icon variant="small" defaultcolor="currentColor">
      edit
    </Icon>
  </IconButton>
</Link> */}
        {item.isDefault === false ?
          <IconButton onClick={() => deleAdd(item.id)}>

            <Icon variant="small" defaultcolor="currentColor">
              delete
            </Icon>
          </IconButton>
          : ''}
      </Typography>

    </TableRow>
  );
}
