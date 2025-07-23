interface Props {
  params: Promise<{ category: string }>;
}

const page = async ({ params }: Props) => {
  const { category } = await params;
  return <div>{category}:Types Category</div>;
};

export default page;
