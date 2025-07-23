interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}

const page = async ({ params }: Props) => {
  const { category, subcategory } = await params;
  return (
    <div>
      Types Category {category}<br />Types Subcategory: {subcategory}
    </div>
  );
};

export default page;
