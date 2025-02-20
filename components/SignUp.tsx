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
import { Eye, EyeOff } from "lucide-react";
import TextField from "./TextField";

export const ShowPassword: React.FC<{
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showPassword, setShowPassword }) => (
  <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
    {showPassword ? <Eye /> : <EyeOff />}
  </button>
);

type FormData = {
  fullname: string;
  email?: string;
  phone: string;
  password: string;
  rememberMe: boolean;
  checkbox: boolean;
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      password: "",
      rememberMe: false,
      checkbox: false,
    },
  });
  const [callCode, setCallCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { user, session } = useAppContext();
  const params = new URLSearchParams(searchParams);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const phone = watch("phone");

  useEffect(() => {
    if (
      phone.startsWith("010") ||
      phone.startsWith("011") ||
      phone.startsWith("012") ||
      phone.startsWith("015")
    ) {
      setCallCode("+2");
    } else if (phone.startsWith("5")) {
      setCallCode("+966");
    }
  }, [phone]);

  const validatePhone = (
    phone: string | boolean | undefined
  ): true | string => {
    if (typeof phone !== "string") {
      return "Invalid phone number format";
    }
    if (!libphonenumber(`${callCode}${phone}`)?.isValid()) {
      return "Please enter a valid phone number";
    }

    return true;
  };

  const onSubmit = handleSubmit(async (fData) => {
    try {
      setLoading(true);
      const signUpData = { ...fData };
      delete signUpData.email;

      if (fData.email) {
        signUpData.email = fData.email;
      }

      const { data } = await axios.post(
        `/api/auth/signup`,
        {
          ...signUpData,
          phone: `${callCode}${signUpData.phone}`,
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
          <TextField
            register={register}
            name="fullname"
            placeholder="Full Name"
            label={<ProfileIcon className="size-5" />}
            error={errors.fullname?.message as string}
            rules={{
              required: "Please enter your full name",
            }}
          />
          <TextField
            register={register}
            name="phone"
            placeholder="Email or Mobile number"
            label={<PhoneIcon className="size-5" />}
            error={errors.phone?.message as string}
            type="tel"
            rules={{
              required: "Please enter Email or Mobile number",
              validate: validatePhone,
            }}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-5">
          <TextField
            register={register}
            name="email"
            placeholder="Email"
            type="email"
            label={<PhoneIcon className="size-5" />}
            error={errors.email?.message as string}
            rules={{
              required: false,
            }}
          />
          <TextField
            register={register}
            name="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            error={errors?.password?.message as string}
            label={<PasswordIcon className="size-5" />}
            rules={{
              required: "Please enter the password",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            icon={
              <ShowPassword
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="rememberMe" className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="size-4 accent-[#223F48]"
              id="rememberMe"
            />
            <span>Remember me</span>
          </label>
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
              className="size-4 accent-[#223F48]"
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
