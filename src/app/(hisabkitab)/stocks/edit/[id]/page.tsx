"use client";
import { getStock } from "@/components/services/stockes.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AddUpdatestock from "../../addUpdatestock/[id]/page";

export default function UpdateStock() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["stocksforUpdate", id],
    queryFn: async () => await getStock(id.toString()),
  });

  return (
    <div>
      <AddUpdatestock
        objStock={data?.data}
        updateId={id.toString()}
        headingName="Update Stocks"
      />
    </div>
  );
}
