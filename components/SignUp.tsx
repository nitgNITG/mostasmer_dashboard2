"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { EmailIcon, PasswordIcon, PhoneIcon, ProfileIcon } from "./Icons";
import libphonenumber from "libphonenumber-js";
import ErrorMsg from "./ErrorMsg";
import Link from "next/link";
import axios from "axios";
import { setCookie } from "@/lib/cookies-client";
import toast, { LoaderIcon } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/appContext";
import LinkSession from "./LinkSession";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  const [callCode, setCallCode] = useState("+966");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { user, session } = useAppContext();
  const params = new URLSearchParams(searchParams);
  const onSubmit = handleSubmit(async (fData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/auth/signup`,
        {
          ...fData,
          phone: `${callCode}${fData.phone}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCookie("token", data.token, 360);
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="pt-10">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full">
            <div className="flex gap-5 items-center w-full">
              <div className="absolute px-2">
                <ProfileIcon className="size-5" />
              </div>
              <label
                htmlFor="fullname"
                className="w-full relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <input
                  type="text"
                  id="fullname"
                  {...register("fullname", {
                    required: "Please enter the fullname",
                  })}
                  className="py-3 px-8 w-full peer border-none bg-transparent placeholder-transparent focus:placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"Mostasmer"}
                />
                <span className="pointer-events-none absolute start-8 peer-focus:start-0.5 top-0 -translate-y-1/2 bg-white px-3 py-0.5 text-sm text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-0 peer-focus:text-xs">
                  Full Name
                </span>
              </label>
            </div>
            <ErrorMsg message={errors?.fullname?.message as string} />
          </div>
          <div className="w-full">
            <div className="flex w-full border rounded-md shadow-sm">
              <select
                value={callCode}
                onChange={(e) => {
                  setCallCode(e.target.value);
                }}
                className=""
              >
                <option value="+20">+20</option>
                <option value="+966">+966</option>
              </select>
              <div className="w-full">
                <div className="flex gap-5 items-center w-full">
                  <div className="absolute px-2">
                    <PhoneIcon className="size-5" />
                  </div>
                  <label
                    htmlFor="phone"
                    className="w-full relative block  border-y border-r border-transparent border-gray-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <input
                      type="text"
                      id="phone"
                      {...register("phone", {
                        required: "Please enter the phone",
                        validate: (phone) => {
                          if (
                            !libphonenumber(`${callCode}${phone}`)?.isValid()
                          ) {
                            return `invalid phone number`;
                          }
                        },
                      })}
                      className="py-3 px-8 w-full peer border-none bg-transparent placeholder-transparent focus:placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0"
                      placeholder={
                        callCode == "+20" ? "010123456789" : "056789123"
                      }
                    />
                    <span className="pointer-events-none absolute start-8 peer-focus:start-0.5 top-0 -translate-y-1/2 bg-white px-3 py-0.5 text-sm text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-0 peer-focus:text-xs">
                      Phone
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <ErrorMsg message={errors?.phone?.message as string} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full">
            <div className="flex gap-5 items-center w-full">
              <div className="absolute px-2">
                <EmailIcon className="size-5" />
              </div>
              <label
                htmlFor="email"
                className="w-full relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="py-3 px-8 w-full peer border-none bg-transparent placeholder-transparent focus:placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"mostasmer@gmail.com"}
                />
                <span className="pointer-events-none absolute start-8 peer-focus:start-0.5 top-0 -translate-y-1/2 bg-white px-3 py-0.5 text-sm text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-0 peer-focus:text-xs">
                  Eamil
                </span>
              </label>
            </div>
            <ErrorMsg message={errors?.email?.message as string} />
          </div>
          <div className="w-full">
            <div className="flex gap-5 items-center w-full">
              <div className="absolute px-2">
                <PasswordIcon className="size-5" />
              </div>
              <label
                htmlFor="password"
                className="w-full relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Please enter the password",
                  })}
                  className="py-3 px-8 w-full peer border-none bg-transparent placeholder-transparent focus:placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder={"*************"}
                />
                <span className="pointer-events-none absolute start-8 peer-focus:start-0.5 top-0 -translate-y-1/2 bg-white px-3 py-0.5 text-sm text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-md peer-focus:top-0 peer-focus:text-xs">
                  Password
                </span>
              </label>
            </div>
            <ErrorMsg message={errors?.password?.message as string} />
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 items-center">
          <button
            disabled={loading}
            className="bg-primary text-white w-44 h-10 rounded-full flex justify-center items-center"
          >
            {loading ? <LoaderIcon className="!size-5 " /> : "Continue"}
          </button>
          <p className="font-medium">
            Already have an account?{" "}
            <LinkSession href={"/"} className="font-bold text-primary">
              Sign In
            </LinkSession>
          </p>
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              {...register("checkbox", { required: "Please check box" })}
              className="size-4"
            />
            <p className="font-medium">
              by signing up, you agree to{" "}
              <Link href={"/"} className="font-bold text-primary">
                terms & conditions
              </Link>{" "}
              &{" "}
              <Link href={"/"} className="font-bold text-primary">
                privacy policy.
              </Link>
            </p>
          </div>
          <ErrorMsg message={errors.checkbox?.message as string} />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
