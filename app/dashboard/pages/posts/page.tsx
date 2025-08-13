import { promises as fs } from "fs";
import path from "path";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import PostsDataTable from "./table";
import { generateMeta } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewPostForm from "./new/form";

export async function generateMetadata() {
  return generateMeta({
    title: "Posts",
    description: "Lista de posts",
    canonical: "/dashboard/pages/posts"
  });
}

async function getPosts() {
  const dataFile = path.join(process.cwd(), "data", "posts.json");
  try {
    const data = await fs.readFile(dataFile);
    return JSON.parse(data.toString());
  } catch {
    return [];
  }
}

export default async function Page() {
  const posts = await getPosts();
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircledIcon className="me-2" /> Novo Post
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Novo Posts no Feed</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <NewPostForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <PostsDataTable data={posts} />
    </>
  );
}


