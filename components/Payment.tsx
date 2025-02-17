"use client";
import { useAppContext } from "@/context/appContext";
import { deleteCookie } from "@/lib/cookies-client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";

const Payment = ({ session }: { session: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAppContext();
  const { push } = useRouter();
  const handlePayment = async () => {
    try {
      setLoading(true);
      console.log({ session });

      const { data } = await axios.post(
        `/api/payment/${session}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      toast.success(data.message);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    deleteCookie("token");
    push("/");
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="flex justify-center gap-3">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-5 py-2 bg-indigo-500 rounded-md text-white font-semibold"
      >
        {loading ? <LoaderIcon className="!size-5 " /> : "Payment"}
      </button>
      <button
        className="px-5 py-2 bg-indigo-500 rounded-md text-white font-semibold"
        onClick={logout}
      >
        logout
      </button>
    </div>
  );
};

export default Payment;
