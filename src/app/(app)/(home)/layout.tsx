import { Categorise } from "@/payload-types";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilter } from "./search-filters";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { CustomCategory } from "./types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categorise",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort:"name"
  });

  // Fixed formatting with proper error handling
  const formatedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    // Fixed property name consistency
    subcategorise: Array.isArray(doc.subCategorise?.docs) 
      ? doc.subCategorise.docs.map((subDoc) => ({
          ...(subDoc as Categorise),
          // Remove nested subcategories to avoid infinite nesting
          subCategorise: undefined
        }))
      : [], // Default to empty array instead of undefined
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilter data={formatedData} />
      <div className="flex-1 bg-[#f0f0f1]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;