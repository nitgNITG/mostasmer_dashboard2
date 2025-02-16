import Login from '@/components/Login'
import Link from 'next/link'
import React from 'react'

const Home = () => {
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
                        Log in
                    </div>
                    <div className=" flex items-center justify-center">
                        <div className="w-full">
                            <Login />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home