"use client";
import { Icons } from "@/common/icons";
import SearchInput from "@/common/SearchInput";
import Table from "@/common/Table";
import { Toast } from "@/common/Toast";
import { formatDate } from "@/common/utils";
import {
  deleteEmployeeWork,
  getEmployeeWorks,
} from "@/components/services/employee.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { IWorkHistory } from "../page";

export default function Page({ params }: { params: any }) {
  const [searchWork, setSearchWork] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const itemsPerPage = 10;
  console.log(selectedMonth);
  const router = useRouter();
  const { data, isFetching, isPending, isLoading, refetch } = useQuery({
    queryKey: ["merchantList"],
    queryFn: async () => await getEmployeeWorks(params.id.toString()),
  });

  const columns = [
    {
      header: "Design",
      accessor: (row: any) => (
        <h5 className="font-medium text-black dark:text-white">
          {row.itemName}
        </h5>
      ),
      className: "min-w-[100px]",
    },
    {
      header: "Date",
      accessor: (row: any) => (
        <h5 className=" text-black dark:text-white">{formatDate(row.date)}</h5>
      ),
      className: "min-w-[150px]",
    },
    {
      header: "Quantity",
      accessor: "quantity",
      className: "min-w-[100px]",
    },

    {
      header: "Rate",
      accessor: "itemPrice",
      className: "min-w-[100px]",
    },
    {
      header: "Total",
      accessor: (row: any) => (
        <h5 className="font-bold text-green-600 dark:text-white">
          ₹{row.totalPrice}
        </h5>
      ),
      className: "min-w-[100px]",
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center space-x-3.5">
          <Icons.editIcon
            className="w-6 cursor-pointer"
            onClick={() => router.push(`/employee/editWork/${row._id}`)}
          />
          <Icons.deleteIcon
            className="w-6 cursor-pointer"
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
                    await deleteEmployeeWork(row._id);
                    Toast.show("Employee Work deleted successfully", "success");
                    Swal.fire({
                      title: "Deleted!",
                      text: "Works deleted successfully",
                      icon: "success",
                    });
                  }
                });
                refetch();
              } catch (e) {
                Toast.show("Something went wrong. Please try again", "error");
              }
            }}
          />
        </div>
      ),
    },
  ];

  const filterWorks = data?.data?.workHistory?.filter((work: IWorkHistory) => {
    const isWorkMatch = searchWork
      ? work.itemName.toLowerCase().includes(searchWork.toLowerCase())
      : true;

    const isMonthMatch = selectedMonth
      ? (() => {
          const [selectedYear, selectedMonthValue] = selectedMonth.split("-");
          const workDate = new Date(work.date);
          const workYear = workDate.getFullYear();
          const workMonth = String(workDate.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
          return (
            selectedYear === String(workYear) &&
            selectedMonthValue === workMonth
          );
        })()
      : true;

    return isWorkMatch && isMonthMatch;
  });

  const paginatedData = filterWorks?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil((filterWorks?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  return (
    <div>
      <div className="mb-2">
        <div className="mb-2 flex justify-between">
          <SearchInput
            onchange={(value) => {
              setSearchWork(value);
            }}
            value={searchWork}
          />

          <button
            onClick={() => router.push(`/employee/work/${params.id}`)}
            className="inline-flex w-auto items-center justify-center gap-2.5 rounded-md bg-primary px-4 py-[9px] text-center font-medium text-white hover:bg-opacity-90"
          >
            + Add Work
          </button>
        </div>
        <div className="flex flex-row justify-end gap-5 overflow-scroll">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-md border px-4 py-2"
          />
        </div>
      </div>
      <Table
        data={paginatedData || []}
        columns={columns as any}
        isLoading={isLoading}
        isPending={isPending}
        isFetching={isFetching}
        skeletonRowCount={data?.data?.length}
      />
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
