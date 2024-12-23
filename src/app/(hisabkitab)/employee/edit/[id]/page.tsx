"use client";
import { getEmployee } from "@/components/services/employee.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AddUpdateEmployee from "../../create/page";

export default function Page() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => await getEmployee(id.toString()),
  });

  console.log(data?.data.employee);

  return (
    <div>
      <AddUpdateEmployee
        objEmployee={data?.data?.employee}
        id={id.toString()}
        headingName={"Update Employee"}
      />
    </div>
  );
}
