import SideSlide from "@/components/SideSlide";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ sessionId: string }>;
}>) {
    const token = await (await cookies()).get('token')?.value;
    const sessionId = (await params).sessionId;
    if (!token) {
        redirect(`/${sessionId}`)
    }
    return (
        <div className="flex min-h-svh bg-[#F0F2F5]">
            <SideSlide sessionId={sessionId} />
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
