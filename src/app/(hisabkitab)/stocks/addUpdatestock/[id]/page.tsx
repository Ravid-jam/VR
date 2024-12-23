"use client";
import Input from "@/common/Inpute";
import { Toast } from "@/common/Toast";
import {
  createStock,
  updateStock,
} from "@/components/services/stockes.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  merchantId: yup.string().required("Seller name is required"),
  name: yup.string().required("Stock name is required"),
  quantity: yup
    .number()
    .typeError("Total stock must be a number")
    .positive("Total stock must be a positive number")
    .required("Total stock is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .required("Per stock price is required"),
});

export default function AddUpdatestock(
  objStock?: any,
  headingName?: string,
  updateId?: string,
) {
  const router = useRouter();
  const { id } = useParams();
  console.log(id);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      merchantId: id.toString(),
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (objStock.updateId) {
        const res = await updateStock(objStock.updateId, data);
        if (res.data) {
          Toast.show("Stock updated successfully", "success");
          router.push("/merchant");
        }
      } else {
        const res = await createStock(data);
        if (res.data) {
          Toast.show("Stock added successfully", "success");
          router.push("/merchant");
        }
      }
    } catch (error) {
      Toast.show("Something went wrong. Please try again", "error");
    }
  };
  useEffect(() => {
    reset({
      merchantId: objStock?.objStock?.merchantId,
      name: objStock?.objStock?.name,
      quantity: objStock?.objStock?.quantity,
      price: objStock?.objStock?.price,
    });
  }, [objStock, reset]);

  useEffect(() => {
    reset({
      merchantId: id.toString(),
    });
  }, [id, reset]);
  return (
    <div>
      <h1 className="mb-3 block text-2xl font-bold text-black dark:text-white">
        {objStock.headingName ? objStock.headingName : "Add Stock"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5.5 pt-4"
      >
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Stock Name
          </label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input {...field} type="text" error={!!errors.name} />
            )}
          />
          {errors && (
            <p className="text-sm text-red-500">{errors?.name?.message}</p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Total Stock
          </label>
          <Controller
            control={control}
            name="quantity"
            render={({ field }) => (
              <Input {...field} type="number" error={!!errors.quantity} />
            )}
          />
          {errors && (
            <p className="text-sm text-red-500">{errors?.quantity?.message}</p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Per Stock Price
          </label>
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <Input {...field} type="number" error={!!errors.price} />
            )}
          />
          {errors && (
            <p className="text-sm text-red-500">{errors?.price?.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4.5">
          <button
            className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            onClick={() => router.push("/merchant")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
