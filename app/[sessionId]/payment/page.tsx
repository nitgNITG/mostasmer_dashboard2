import Payment from "@/components/Payment";
import React from "react";

const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const searchPrms = await params;
  return (
    <div className="p-5 flex flex-col justify-center gap-3 h-svh">
        <h1 className="font-bold text-3xl">Welcome</h1>
      <div className=" w-full bg-white h-4/5 rounded-lg px-5 py-10">
        <Payment session={searchPrms.sessionId} />
      </div>
    </div>
  );
};

export default Page;
