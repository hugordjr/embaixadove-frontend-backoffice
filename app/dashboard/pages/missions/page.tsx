import { promises as fs } from "fs";
import path from "path";

import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import MissionsDataTable from "./data-table";
import { generateMeta } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewMissionForm from "./new/form";

export async function generateMetadata() {
  return generateMeta({
    title: "Missions - Shadcn UI Kit Free",
    description: "A list of missions created using the Tanstack Table.",
    canonical: "/pages/missions"
  });
}

async function getMissions() {
  const dataPath = path.join(process.cwd(), "data", "missions.json");
  try {
    const data = await fs.readFile(dataPath);
    return JSON.parse(data.toString());
  } catch {
    return [];
  }
}

export default async function Page() {
  const missions = await getMissions();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Missões</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircledIcon className="me-2" /> Nova Missão
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Nova Missão</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <NewMissionForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <MissionsDataTable data={missions} />
    </>
  );
}


