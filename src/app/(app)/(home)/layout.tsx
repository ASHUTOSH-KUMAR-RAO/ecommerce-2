import { Categorise } from "@/payload-types";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilter } from "./search-filters";

import configPromise from "@payload-config";
import { getPayload } from "payload";

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
  });

  const formatedData = data.docs.map((doc) => ({
    ...doc,
    subcategorise: (doc.subCategorise?.docs ?? []).map((doc) => ({
      ...(doc as Categorise),
      subCategorise:undefined
    })),
  }));

  console.log({
    data,
    formatedData,
  });

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
