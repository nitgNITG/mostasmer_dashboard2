import React from 'react'

const ErrorMsg = ({ message }: { message?: string }) => {
    return (
        <>
            {message ? <div className='text-red-500'>
                {message}
            </div> : ""}
        </>
    )
}

export default ErrorMsg