import { promises as fs } from "fs";
import path from "path";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import LevelsDataTable from "./table";
import { generateMeta } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewLevelForm from "./new/form";

export async function generateMetadata() {
  return generateMeta({
    title: "Níveis",
    description: "Lista de níveis",
    canonical: "/dashboard/pages/levels"
  });
}

async function getLevels() {
  const dataFile = path.join(process.cwd(), "data", "levels.json");
  try {
    const data = await fs.readFile(dataFile);
    return JSON.parse(data.toString());
  } catch {
    return [];
  }
}

export default async function Page() {
  const levels = await getLevels();
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Níveis</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircledIcon className="me-2" /> Novo Nível
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Novo Nível</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <NewLevelForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <LevelsDataTable data={levels} />
    </>
  );
}


