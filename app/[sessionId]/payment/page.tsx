import Payment from '@/components/Payment';
import React from 'react'

const Page = async ({ params }: { params: Promise<{ sessionId: string; }> }) => {
    const searchPrms = await params;
    return (
        <div className='h-svh w-full flex  items-center'>
            <Payment session={searchPrms.sessionId} />
        </div>
    )
}

export default Page