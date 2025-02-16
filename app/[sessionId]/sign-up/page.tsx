import SignUp from "@/components/SignUp";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-5 flex items-center min-h-svh">
      <div className=" w-full bg-white rounded-lg px-5 py-10">
        <div className="flex justify-end">
          <Link className="text-primary underline font-semibold" href={'/about'}>
            About us
          </Link>
        </div>
        <div className="px-5 py-20">
          <div className="text-center text-3xl font-bold">
            Sign Up
          </div>
          <div className=" flex items-center justify-center">
            <div className="w-full">
              <SignUp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
