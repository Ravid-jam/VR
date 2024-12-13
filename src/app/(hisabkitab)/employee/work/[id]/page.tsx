"use client";
import Input from "@/common/Inpute";
import { Toast } from "@/common/Toast";
import {
  createEmployeeWorks,
  updateEmployeeWork,
} from "@/components/services/employee.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  employeeId: yup.string().notRequired(),
  itemName: yup.string().required("Design name is required"),
  itemPrice: yup.string().required("Price is required"),
  quantity: yup.number().required("Quantity is required"),
});

export default function AddUpdateEmployeeWork(
  objEmployeeWork?: any,
  updateId?: any,
  headingName?: string,
) {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      employeeId: id.toString() || "",
    },
  });

  const router = useRouter();
  useEffect(() => {
    if (objEmployeeWork) {
      reset({
        itemName: objEmployeeWork.itemName || "",
        itemPrice: objEmployeeWork.itemPrice || "",
        quantity: objEmployeeWork.quantity || "",
      });
    }
  }, [objEmployeeWork, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (updateId) {
        const res = await updateEmployeeWork(updateId, data);
        if (res?.data) {
          Toast.show("Work updated successfully", "success");
          router.push(`/employee/${objEmployeeWork?.employeeId?._id}`);
        } else {
          Toast.show("Something went wrong. Please try again!", "error");
        }
      } else {
        const res = await createEmployeeWorks(data);
        if (res) {
          Toast.show("Work added successfully", "success");
          router.push(`/employee`);
        } else {
          Toast.show("Something went wrong. Please try again!", "error");
        }
      }
    } catch (error) {
      Toast.show("Something went wrong. Please try again!", "error");
    }
  };
  return (
    <div>
      <h1 className="mb-3 block text-2xl font-bold text-black dark:text-white">
        {headingName ? headingName : "Add work"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5.5 pt-4">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Design Name
            </label>
            <Input
              type="text"
              {...register("itemName")}
              error={!!errors.itemName}
            />
            {errors.itemName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.itemName.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Quantity
            </label>
            <Input
              type="number"
              {...register("quantity")}
              error={!!errors.quantity}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">
                {errors.quantity.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Design Price
            </label>
            <Input
              type="string"
              {...register("itemPrice")}
              error={!!errors.itemPrice}
            />
            {errors.itemPrice && (
              <p className="mt-1 text-sm text-red-500">
                {errors.itemPrice.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              type="button"
              onClick={() => router.push("/employee")}
            >
              Cancel
            </button>
            <button
              className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
