// 'use client';
import { useAppContext } from "@/context/appContext";
import { fetchData } from "@/lib/fetchData";
import { headers } from "next/headers";
import Image from "next/image";
import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect } from "react";
import { LoaderIcon } from "react-hot-toast";

const SideSlide = async ({ sessionId }: { sessionId: string }) => {
  console.log(sessionId);

  const { data, loading, error } = await fetchData(
    `/api/order-session/${sessionId}`,
    {
      next: { revalidate: 100 },
    }
  );
  const session = data?.session;
  if (!session || error) {
    redirect("/session-ended");
  }
  return (
    <>
      {!loading ? (
        <div className="w-full bg-black flex flex-col min-h-svh">
          <div className="place-items-center py-7">
            <Image
              src={"/dash_ico.svg"}
              alt="Logo"
              width={200}
              height={200}
              priority
              className="object-contain"
            />
          </div>
          <div className="bg-white flex flex-col gap-5 flex-1">
            <div className="place-items-center py-3">
              <h1 className="text-4xl text-nowrap w-min font-bold bg-[linear-gradient(90deg,#223F48_-46%,#5AC3E2_100%)] bg-clip-text text-transparent">
                Paypoins
              </h1>
            </div>
            <div className="relative flex items-center">
              <div className="w-full h-[1px] bg-black" />
              <div className="absolute text-black mx-10 bg-white px-10">
                Brand Name
              </div>
            </div>
            <div className="p-5 flex items-center gap-10">
              <Image
                src={`${session?.brand?.logo || "/brandImage.png"}`}
                alt="Logo"
                width={800}
                height={700}
                loading="lazy"
                className="size-20 object-cover rounded-full"
              />
              <div>
                <p className="text-[#9C9C9C] text-2xl">
                  {session?.brand?.name}
                </p>
              </div>
            </div>
            <div className="relative flex items-center">
              <div className="w-full h-[1px] bg-black" />
              <div className="absolute text-black mx-10 bg-white px-10">
                Order Amount
              </div>
            </div>
            <div className="p-5 flex items-center gap-10">
              <p className="text-black text-4xl">
                {session?.amount + " "}
                SR
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-5">
            <Image
              src={"/nit.svg"}
              alt="nit-Logo"
              width={200}
              height={200}
              priority
              className="object-contain size-14"
            />
            <a className="text-white" href="https://www.nitg-eg.com" target="_blank">
              www.nitg-eg.com
            </a>
          </div>
        </div>
      ) : (
        <div className="w-full bg-darkColor hidden lg:flex justify-center items-center">
          <LoaderIcon className="!size-44" />
        </div>
      )}
    </>
  );
};

export default SideSlide;
