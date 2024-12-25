"use client";
import { Icons } from "@/common/icons";
import { Toast } from "@/common/Toast";
import { login } from "@/components/services/signIng.service";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().email().required("Email address is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await login(data);
      if (response?.data.user) {
        localStorage.setItem("admin", JSON.stringify(response.data.user));
        Cookies.set("refreshToken", response.data.token, { expires: 1 });
        localStorage.setItem("adminId", response.data.user._id);
        setLoading(false);
        router.push("/home");
        Toast.show("Logged in successfully", "success");
      } else {
        Toast.show("Invalid email or password", "error");
      }
    } catch (err) {
      Toast.show("Something went wrong. Please try again", "error");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="px-26 py-17.5 text-center">
            <Link className="mb-5.5 inline-block" href="/">
              <div className="flex flex-shrink-0 items-center gap-x-5">
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-icon.svg"}
                  alt="Logo"
                  width={40}
                  height={40}
                />
                <span className="text-3xl font-bold text-black">VR</span>
              </div>
            </Link>

            <p className="2xl:px-20">Start with VR Brothers</p>

            <span className="mt-15 inline-block">
              <Icons.loginImage />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <div className=" flex flex-shrink-0 items-center justify-center gap-x-5 pb-4 sm:hidden">
              <Image
                className="dark:hidden"
                src={"/images/logo/logo-icon.svg"}
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="text-3xl font-bold text-black">VR</span>
            </div>
            <span className="mb-1.5  hidden font-medium sm:block">
              Start for free
            </span>

            <h2 className="mb-9 text-center text-2xl font-bold text-black dark:text-white sm:text-start sm:text-title-xl2">
              Sign In to VR
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full rounded-lg border py-2 pl-4 pr-10 text-black outline-none ${errors.email ? "border-red-500 dark:border-red-500" : " border-stroke focus:border-primary focus-visible:shadow-none "}`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                  <span className="absolute right-4 top-2">
                    <Icons.loginMail />
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="6+ Characters, 1 Capital letter"
                    className={`w-full rounded-lg border py-2 pl-4 pr-10 text-black outline-none ${errors.password ? "border-red-500 dark:border-red-500" : " border-stroke focus:border-primary focus-visible:shadow-none "}`}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                  <span className="absolute right-4 top-2">
                    <Icons.loginPassword />
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <button
                  type="submit"
                  disabled={loading}
                  className={`me-2 inline-flex w-full  items-center rounded-lg bg-primary px-5 py-2.5 text-center text-base font-medium text-white  ${
                    loading
                      ? "flex cursor-not-allowed items-center justify-center text-center"
                      : "flex justify-center"
                  }`}
                >
                  {loading ? (
                    <>
                      <Icons.loginLoader />
                      Loading...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
