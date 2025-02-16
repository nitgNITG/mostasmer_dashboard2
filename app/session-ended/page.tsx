import Image from 'next/image'
import React from 'react'

const page = () => {
    return (
        <div>
            <div className="grid h-screen place-content-center bg-white px-4">
                <div className="text-center">
                    <Image
                        src={'/session-ended.svg'}
                        width={1000}
                        height={1000}
                        priority
                        className='size-[90%]'
                        alt=''
                    />
                    <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</h1>
                    <p className="mt-4 text-gray-500">Session ended</p>
                </div>
            </div>
        </div>
    )
}

export default page