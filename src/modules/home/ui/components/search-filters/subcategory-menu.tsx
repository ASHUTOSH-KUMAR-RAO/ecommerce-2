import { CategoriesDetManyOutput } from "@/modules/categories/types";
import { Categorise } from "@/payload-types";
import Link from "next/link";

interface Props {
  category: CategoriesDetManyOutput[1];
  isOpen: boolean;
}

export const SubCategoryMenu = ({ category, isOpen }: Props) => {
  if (
    !isOpen ||
    !category.subCategorise ||
    !category.subCategorise.docs ||
    category.subCategorise.docs.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#F55487";

  return (
    <div
      className="absolute z-10"
      style={{
        top: "100%",
        left: 0,
      }}
    >
      <div className="h-3 w-60" />
      <div
        style={{ backgroundColor }}
        className="w-50 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]"
      >
          {category.subCategorise.docs.map((subcategory: string | Categorise ) => (
            <Link
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
              key={typeof subcategory === "string" ? subcategory : subcategory.slug}
              href={
                typeof subcategory === "string"
                  ? `/${category.slug}/${subcategory}`
                  : `/${category.slug}/${subcategory.slug}`
              }
            >
              {typeof subcategory === "string" ? subcategory : subcategory.name}
            </Link>
          ))}
         
        </div>
      </div>
  );
};
