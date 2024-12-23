"use client";
import Input from "@/common/Inpute";
import { Toast } from "@/common/Toast";
import {
  createEmployee,
  updateEmployee,
} from "@/components/services/employee.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  mobile: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  address: yup.string().required("Address is required"),
});

export default function CreateEmployee(
  objEmployee?: any,
  id?: string,
  headingName?: string,
) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (objEmployee.id) {
        const res = await updateEmployee(objEmployee.id, data);
        if (res?.data) {
          Toast.show("Employee updated successfully", "success");
          router.push("/employee");
        } else {
          Toast.show("Something went wrong. Please try again!", "error");
        }
      } else {
        const res = await createEmployee(data);
        if (res?.data) {
          Toast.show("Employee added successfully", "success");
          router.push("/employee");
        } else {
          Toast.show("Something went wrong. Please try again!", "error");
        }
      }
    } catch (error) {
      Toast.show("Something went wrong. Please try again!", "error");
    }
  };

  useEffect(() => {
    if (objEmployee?.objEmployee) {
      reset({
        name: objEmployee?.objEmployee?.name || "",
        mobile: objEmployee?.objEmployee?.mobile || "",
        address: objEmployee?.objEmployee?.address || "",
      });
    }
  }, [objEmployee, reset]);
  return (
    <div>
      <h1 className="mb-3 block text-2xl font-bold text-black dark:text-white">
        {headingName ? headingName : "Add Worker"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5.5 pt-4">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Name
            </label>
            <Input type="text" {...register("name")} error={!!errors.name} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Mobile No.
            </label>
            <Input type="tel" {...register("mobile")} error={!!errors.mobile} />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-500">
                {errors.mobile.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Address
            </label>
            <Input
              type="text"
              {...register("address")}
              error={!!errors.address}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message?.toString()}
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
