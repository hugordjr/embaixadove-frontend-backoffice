import { promises as fs } from "fs";
import path from "path";

import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import InfluencerDataTable from "./data-table";
import { generateMeta } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewInfluencerForm from "./new/form";

export async function generateMetadata() {
  return generateMeta({
    title: "Influenciadores",
    description: "Lista de influenciadores",
    canonical: "/dashboard/pages/influencer"
  });
}

async function getInfluencers() {
  const dataFile = path.join(process.cwd(), "data", "influencers.json");
  try {
    const data = await fs.readFile(dataFile);
    return JSON.parse(data.toString());
  } catch {
    return [];
  }
}

export default async function Page() {
  const influencers = await getInfluencers();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Influenciadores</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircledIcon className="me-2" /> Novo Influenciador
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Novo Influenciador</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <NewInfluencerForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <InfluencerDataTable data={influencers} />
    </>
  );
}


