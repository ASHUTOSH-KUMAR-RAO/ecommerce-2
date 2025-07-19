import { Categorise } from "@/payload-types";
import { CategoryDropDown } from "./category-dropdown";
import { Button } from "@/components/ui/button";

interface Props {
  data: any;
}

export const Categories = ({ data }: Props) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center">
        {data.map((category: Categorise) => (
          <div key={category.id}>
            <CategoryDropDown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
