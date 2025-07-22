
import { cookies as getCookies } from "next/headers"

interface Props {
    prefix:string,
    value:string
}

export const generateAuthCookies = async ({prefix,value}:Props) => {
    const cookies = await getCookies();
    cookies.set({
        name: `${prefix}-token`, //! Aur pta hai yeha maine isiliye ye add kiya hai n kyuki isiese mere ko payload ka token default mill jayega
        value: value,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
       
    });

}