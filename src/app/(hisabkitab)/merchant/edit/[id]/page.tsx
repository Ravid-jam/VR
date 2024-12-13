"use client";
import { getMerchant } from "@/components/services/merchants.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AddUpdateMerchant from "../../addUpdatemerchant/AddUpdateMerchant";

export default function Page() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => await getMerchant(id.toString()),
  });
  return (
    <div>
      <AddUpdateMerchant
        headingName="Update Seller"
        objMerchant={data?.data}
        id={id.toString()}
      />
    </div>
  );
}
