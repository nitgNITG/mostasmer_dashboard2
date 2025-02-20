"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordIcon, PhoneIcon } from "./Icons";
import libphonenumber from "libphonenumber-js";
import ErrorMsg from "./ErrorMsg";
import Link from "next/link";
import axios from "axios";
import { LoaderIcon, toast } from "react-hot-toast";
import { setCookie } from "@/lib/cookies-client";
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
  phone: string;
  password: string;
  rememberMe: boolean;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      phone: "",
      password: "",
      rememberMe: false,
    },
  });
  const [callCode, setCallCode] = useState("");
  const [loading, setLoading] = useState(false);

  const { push } = useRouter();
  const { user, session } = useAppContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const phone = watch("phone");

  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

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

  const validatePhone = (phone: string | boolean): true | string => {
    if (typeof phone !== "string") {
      return "Invalid phone number format";
    }

    if (phone.includes("@")) {
      return isValidEmail(phone) ? true : "Please enter a valid email";
    }

    // if (
    //   phone.startsWith("010") ||
    //   phone.startsWith("011") ||
    //   phone.startsWith("012") ||
    //   phone.startsWith("015")
    // ) {
    //   setCallCode("+2");
    // }
    // if (phone.startsWith("5")) {
    //   setCallCode("+966");
    // }
    if (!libphonenumber(`${callCode}${phone}`)?.isValid()) {
      return "Please enter a valid phone number";
    }

    return true;
  };

  const onSubmit = handleSubmit(async (fData) => {
    try {
      setLoading(true);
      const isEmailInput = fData.phone.includes("@");

      const { data } = await axios.post(`/api/auth/login`, {
        ...fData,
        phone: isEmailInput ? fData.phone : `${callCode}${fData.phone}`,
      });

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
    <div className="pt-10 justify-items-center">
      <form onSubmit={onSubmit} className="space-y-5 w-4/5">
        <div className="flex flex-col gap-5">
          <TextField
            register={register}
            name="phone"
            placeholder="Email or Mobile number"
            label={<PhoneIcon className="size-5" />}
            error={errors.phone?.message as string}
            rules={{
              required: "Please enter Email or Mobile number",
              validate: validatePhone,
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
        <div className="flex justify-between">
          <label htmlFor="rememberMe" className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="size-4 accent-[#223F48]"
              id="rememberMe"
            />
            <span>Remember me</span>
          </label>
          <LinkSession
            className="text-primary hover:underline"
            href="/forget-password?"
          >
            Forget password?
          </LinkSession>
        </div>
        <div className="mt-10 flex flex-col gap-3 items-center">
          <button
            disabled={loading}
            className="bg-primary text-white w-44 h-10 rounded-full flex justify-center items-center"
          >
            {loading ? <LoaderIcon className="!size-5 " /> : "Continue"}
          </button>
          <p className="font-medium">
            Don’t have an account?{" "}
            <LinkSession href={"sign-up"} className="font-bold text-primary">
              {" "}
              Sign up
            </LinkSession>
          </p>

          <ErrorMsg message={errors.rememberMe?.message as string} />
        </div>
      </form>
    </div>
  );
};

export default Login;
