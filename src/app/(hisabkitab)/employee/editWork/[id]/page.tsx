"use client";
import { getEmployeeWork } from "@/components/services/employee.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AddUpdateEmployeeWork from "../../work/[id]/page";

export default function Page() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["employeeWork", id],
    queryFn: async () => await getEmployeeWork(id.toString()),
  });
  return (
    <div>
      <AddUpdateEmployeeWork
        headingName="Update Work"
        updateId={id.toString()}
        objEmployeeWork={data?.data}
      />
    </div>
  );
}
