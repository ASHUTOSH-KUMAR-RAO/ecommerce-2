import Stripe from "stripe";

// Type assertion use karo temporary
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     apiVersion: "2023-10-16" as any, // ✅ Temporary fix
//     typescript: true
// })


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil", // ❌ Ye future date hai! // ✅ Temporary fix
    typescript: true
})


//! Jaruri nhi hai .basil wala hi kare hum isme se koi bhi way apna sekte hai ye most probably yehi karna chaiye kyuki ye future based hai aur jo hum use krte hai wo current based use krte hai temporary ke liye 