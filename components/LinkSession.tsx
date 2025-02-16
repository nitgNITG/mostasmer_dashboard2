'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { ReactNode } from 'react'

const LinkSession = ({ children, href, className }: { children: ReactNode, href: string, className: string }) => {
    const params = useParams()
    const sessionId = params.sessionId
    return (
        <Link href={`/${sessionId}/${href}`} className={className}>
            {children}
        </Link>
    )
}

export default LinkSession