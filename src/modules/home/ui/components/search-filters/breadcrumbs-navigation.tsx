import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
  activeCategoryName?: string | null;
  activeSubCategoryName?: string | null;
  activeCategory?: string | null;
}

const BreadcrumbsNavigation = ({
  activeCategoryName,
  activeSubCategoryName,
  activeCategory,
}: Props) => {
  if (!activeCategoryName || activeCategory === "all") return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {activeCategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="hover:text-gray-700 text-xl font-medium underline text-primary"
              >
                <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary font-medium text-lg">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="hover:text-gray-700 text-xl font-medium">
                {activeSubCategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="hover:text-gray-700 text-xl font-medium">
              {activeCategoryName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbsNavigation;
