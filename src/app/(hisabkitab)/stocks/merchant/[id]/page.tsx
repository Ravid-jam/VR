"use client";
import { Icons } from "@/common/icons";
import SearchInput from "@/common/SearchInput";
import Table from "@/common/Table";
import { Toast } from "@/common/Toast";
import { formatDate } from "@/common/utils";
import {
  deleteStock,
  stockMerchantWiseList,
} from "@/components/services/stockes.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function MerchantWiseStockList({ params }: { params: any }) {
  const [searchStock, setSearchStock] = useState("");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isFetching, isPending, isLoading, refetch } = useQuery({
    queryKey: ["product", params.id],
    queryFn: async () => await stockMerchantWiseList(params.id),
  });

  const columns = [
    {
      header: "Design",
      accessor: (row: any) => (
        <h5 className="font-medium text-black dark:text-white">{row.name}</h5>
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
      accessor: "price",
      className: "min-w-[100px]",
    },
    {
      header: "Total",
      accessor: (row: any) => (
        <h5 className="font-bold text-green-600 dark:text-white">
          ₹{row.totalStockPrice}
        </h5>
      ),
      className: "min-w-[100px]",
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center space-x-3.5">
          <Icons.editIcon
            className="w-5 cursor-pointer"
            onClick={() => router.push(`/stocks/edit/${row._id}`)}
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
                    await deleteStock(row._id);
                    Toast.show("Stock deleted successfully", "success");
                    Swal.fire({
                      title: "Deleted!",
                      text: "Stock deleted successfully",
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

  const filteredData = data?.data.filter((row: any) =>
    row.name.toLowerCase().includes(searchStock.toLowerCase()),
  );

  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  const paginatedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="mb-2 flex justify-between">
        <SearchInput
          onchange={(value) => {
            setSearchStock(value);
            setCurrentPage(1);
          }}
          value={searchStock}
        />

        <button
          onClick={() => router.push(`/stocks/addUpdatestock/${params.id}`)}
          className="inline-flex w-auto items-center justify-center gap-2.5 rounded-md bg-primary px-4 py-[9px] text-center font-medium text-white hover:bg-opacity-90"
        >
          + Add Stock
        </button>
      </div>
      <Table
        columns={columns as any}
        data={paginatedData || []}
        isFetching={isFetching}
        isLoading={isLoading}
        skeletonRowCount={data?.data?.length}
        isPending={isPending}
      />

      <div className="mt-4 flex justify-center gap-2">
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
