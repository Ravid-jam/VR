"use client";
import { Icons } from "@/common/icons";
import SearchInput from "@/common/SearchInput";
import { Toast } from "@/common/Toast";
import {
  deleteMerchant,
  merchantList,
} from "@/components/services/merchants.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export interface IMerchant {
  _id: string;
  name: string;
  mobile: string;
  address: string;
  admin: string;
}
export default function Merchant() {
  const router = useRouter();
  const [searchMerchant, setSearchMerchant] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, refetch } = useQuery({
    queryKey: ["merchantList"],
    queryFn: async () => await merchantList(),
  });
  const filteredData = data?.data?.filter((item: IMerchant) =>
    item.name.toLowerCase().includes(searchMerchant.toLowerCase()),
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
            setSearchMerchant(value);
          }}
          value={searchMerchant}
        />
        <button
          onClick={() => router.push("/merchant/addUpdatemerchant")}
          className="inline-flex w-auto items-center justify-center gap-2.5 rounded-md bg-primary px-4 py-[9px] text-center font-medium text-white hover:bg-opacity-90"
        >
          + Add Seller
        </button>
      </div>

      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {paginatedData?.map((item: any, index: number) => {
          return (
            <li key={index} className="py-3 sm:py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    src={"/images/user/user.jpg"}
                    alt={`${item.name} image`}
                    width={32}
                    height={32}
                    className="h-10 w-10 rounded-full border"
                  />
                </div>
                <div className="ms-4 min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </p>

                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {item.mobile}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <div className="inline-flex items-center text-base font-semibold text-green-700 dark:text-white">
                    ₹{item.totalStockPrice}
                  </div>
                  <div className="flex gap-x-3">
                    <Icons.editIcon
                      className="w-6 cursor-pointer"
                      onClick={() => router.push(`/merchant/edit/${item._id}`)}
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
                              await deleteMerchant(item._id);
                              refetch();

                              Toast.show(
                                "Employee deleted successfully",
                                "success",
                              );
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
                      className="w-6 cursor-pointer"
                      onClick={() =>
                        router.push(`/stocks/merchant/${item._id}`)
                      }
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex justify-end gap-2">
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
