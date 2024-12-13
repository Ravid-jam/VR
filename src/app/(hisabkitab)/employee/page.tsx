"use client";
import { Icons } from "@/common/icons";
import SearchInput from "@/common/SearchInput";
import { Toast } from "@/common/Toast";
import {
  deleteEmployee,
  employeeList,
} from "@/components/services/employee.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export interface IWorkHistory {
  date: string;
  employeeId: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface IEmployee {
  _id: string;
  name: string;
  address: string;
  mobile: string;
  workHistory: IWorkHistory[];
}

export default function Employee() {
  const router = useRouter();
  const [searchEmployee, setSearchEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => await employeeList(),
  });

  const lstEmployee = data?.data?.employees;

  const filteredEmployees = lstEmployee?.filter((employee: IEmployee) =>
    employee.name.toLowerCase().includes(searchEmployee.toLowerCase()),
  );

  const paginatedData = filteredEmployees?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil((filteredEmployees?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="mb-2 flex justify-between">
        <SearchInput
          onchange={(value) => {
            setSearchEmployee(value);
          }}
          value={searchEmployee}
        />
        <button
          onClick={() => router.push(`/employee/create`)}
          className="inline-flex w-auto items-center justify-center gap-2.5 rounded-md bg-primary px-4 py-[9px] text-center font-medium text-white hover:bg-opacity-90"
        >
          + Add worker
        </button>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {paginatedData?.map((customer: IEmployee, index: number) => {
          const totalWorkHistoryPrice = customer.workHistory.reduce(
            (acc, work) => acc + (work.totalPrice || 0),
            0,
          );

          return (
            <li key={index} className="py-3 sm:py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    src={"/images/user/user.jpg"}
                    alt={`${customer.name} image`}
                    width={32}
                    height={32}
                    className="h-10 w-10 rounded-full border"
                  />
                </div>
                <div className="ms-4 min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </p>

                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {customer.mobile}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <div className="inline-flex items-center text-base font-semibold text-green-700 dark:text-white">
                    ₹{totalWorkHistoryPrice}
                  </div>
                  <div className="flex gap-x-1">
                    <Icons.editIcon
                      className="w-5 cursor-pointer"
                      onClick={() =>
                        router.push(`/employee/edit/${customer._id}`)
                      }
                    />
                    <Icons.deleteIcon
                      className="w-5 cursor-pointer"
                      onClick={async () => {
                        try {
                          Swal.fire({
                            title: "Are you sure For Delete?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!",
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              await deleteEmployee(customer._id);
                              Toast.show(
                                "Employee deleted successfully",
                                "success",
                              );
                              refetch();

                              Swal.fire({
                                title: "Deleted!",
                                text: "Employee deleted successfully",
                                icon: "success",
                              });
                            }
                          });
                        } catch (e) {
                          Toast.show(
                            "Something went wrong. Please try again",
                            "error",
                          );
                        }
                      }}
                    />
                    <Icons.viewIcon
                      className="w-5 cursor-pointer"
                      onClick={() => router.push(`/employee/${customer._id}`)}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-md px-4 py-2 ${
            currentPage === 1
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-primary text-white hover:bg-opacity-90"
          }`}
        >
          Previous
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`rounded-md px-4 py-2 ${
            currentPage === totalPages
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-primary text-white hover:bg-opacity-90"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
