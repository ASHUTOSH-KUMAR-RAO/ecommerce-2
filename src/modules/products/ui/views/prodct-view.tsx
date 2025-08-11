"use client";

import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

interface Props {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data.images?.url || "/authpages.png"}
            alt={data.name}
            fill
            className="object-cover h-10 w-10"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className="px-4 py-1  rounded-b-sm border bg-pink-400  w-fit">
                  <p className="text-base font-medium">${data.price}</p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                <Link
                  href={generateTenantURL(tenantSlug)}
                  className="flex items-center gap-2"
                >
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant.image.url}
                      alt={data.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  )}
                  <p className="text-base underline font-medium">
                    {data.tenant.name}
                  </p>
                </Link>
              </div>
              <div className="hidden lg:flex items-center justify-center ">
                <div className="flex items-center gap-1">
                  <StarRating rating={3} iconClassName="size-4" />
                </div>
              </div>
            </div>
            <div className="block lg:hidden px-4 py-2 items-center justify-center border-b">
              <div className="flex items-center gap-1">
                <StarRating rating={3} iconClassName="size-4" />
                <p className="text-base font-medium">{5}ratings</p>
              </div>
            </div>
            <div className="p-4">
              {data.description ? (
                <p>{data.description}</p>
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No Description Provided
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 p-6 border-b">
                <div className="flex flex-row items-center gap-2">
                  <Button variant="elevated" className="flex-1 bg-pink-400">
                    Add To Cart
                  </Button>
                  <Button
                    variant="elevated"
                    className="size-12 bg-amber-200"
                    disabled={false}
                    onClick={() => {}}
                  >
                    <LinkIcon />
                  </Button>
                </div>
                <p className="text-center font-medium">
                  {data.reFundPolicy == "no_refund"
                    ? "no_refund"
                    : `${data.reFundPolicy} money back gaurente`}
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-medium">Ratings</p>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({5})</p>
                    <p className="text-base">{5} ratings</p>
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </div>
                      <Progress value={100} className="h-[1lh]" />
                      <div className="font-medium">{}%</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
