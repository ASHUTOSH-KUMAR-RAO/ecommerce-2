import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query"
import ReviewForm from "./review-form";

interface Props{
  productId:string
}

const ReviewSidebar = ({productId}:Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({ productId })
  ); // Jaab Bhi hum useSuspenceQuery krenge to iske root folder mein hum prefetchQuery use karna hota hai ,aur aise hi useSuspenceQueryInfiniteQuery then iske sath humko InfinitePrefetchQuery use krna hota hai
  return <div>
    <ReviewForm productId={productId} initialData={data}/>
  </div>;
}

export default ReviewSidebar
