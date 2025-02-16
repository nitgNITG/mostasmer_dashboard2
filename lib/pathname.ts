import { headers } from 'next/headers';

const pathname = async () => {
    const headersList = await headers();
    const domain = headersList.get('host') || "";
    const fullUrl = headersList.get('referer') || "";

    try {
        const url = new URLSearchParams()
        const searchParams = await url // Includes '?' and query parameters

        const [, pathname] = fullUrl.match(new RegExp(`https?:\/\/${domain}(.*)`)) || [];
        return { pathname, searchParams };
    } catch (error) {
        console.error('Invalid URL:', fullUrl, error);
        return { pathname: null, searchParams: null };
    }
};

export default pathname;
