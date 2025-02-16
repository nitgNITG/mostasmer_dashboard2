import { cookies } from "next/headers";

const authorization = async () => {
    try {
        const token = await (await cookies()).get('token')?.value;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-me`, {
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (!res.ok) {
            return { data: null, error: await res.json(), loading: false }
        }
        const data = await res.json()
        return { data: data, error: null, loading: false }
    } catch (error) {
        console.error(error);
        return { error, data: null, loading: false }
    }
}

export default authorization;