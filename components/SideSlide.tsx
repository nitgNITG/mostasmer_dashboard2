// 'use client';
import { useAppContext } from '@/context/appContext';
import { fetchData } from '@/lib/fetchData';
import { headers } from 'next/headers';
import Image from 'next/image'
import { redirect, useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { LoaderIcon } from 'react-hot-toast';

const SideSlide = async ({ sessionId }: { sessionId: string }) => {
    console.log(sessionId);

    const { data, loading, error } = await fetchData(`/api/order-session/${sessionId}`, {
        next: { revalidate: 100 }
    })
    const session = data?.session
    if (!session || error) {
        redirect('/session-ended')
    }
    return (
        <>
            {!loading ?
                <div className="w-full bg-darkColor hidden lg:block">
                    <div className='flex justify-center py-10'>
                        <Image
                            src={'/logo.png'}
                            alt="Logo"
                            width={800}
                            height={700}
                            priority
                            className='size-52 object-contain'
                        />
                    </div>
                    <div>
                        <div className='relative flex items-center'>
                            <div className='w-full h-[1px] bg-white' />
                            <div className='absolute text-white mx-10 bg-darkColor px-10'>
                                The Brand
                            </div>
                        </div>
                        <div className=' px-10 py-10 flex items-center gap-10'>
                            <Image
                                src={`${session?.brand?.logo || '/brandImage.png'}`}
                                alt="Logo"
                                width={800}
                                height={700}
                                loading='lazy'
                                // onError={(e) => `/brandImage.png`}
                                className='size-20 object-cover rounded-full'
                            />
                            <div>
                                <p className='text-white/50 text-2xl'>{session?.brand?.name}</p>
                            </div>
                        </div>
                        <div className='relative flex items-center'>
                            <div className='w-full h-[1px] bg-white' />
                            <div className='absolute text-white mx-10 bg-darkColor px-10'>
                                Order amount
                            </div>
                        </div>
                        <div className=' px-10 py-10 flex items-center gap-10'>
                            <p className='text-white text-4xl'>{session?.amount} SR</p>
                        </div>
                    </div>
                </div>
                : <div className="w-full bg-darkColor hidden lg:flex justify-center items-center">
                    <LoaderIcon className='!size-44' />
                </div>
            }
        </>
    )
}

export default SideSlide