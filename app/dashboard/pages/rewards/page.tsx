import { promises as fs } from "fs";
import path from "path";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import RewardsDataTable from "./table";
import { generateMeta } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewRewardForm from "./new/form";

export async function generateMetadata() {
  return generateMeta({
    title: "Recompensas",
    description: "Lista de recompensas",
    canonical: "/dashboard/pages/rewards"
  });
}

async function getRewards() {
  const dataFile = path.join(process.cwd(), "data", "rewards.json");
  try {
    const data = await fs.readFile(dataFile);
    return JSON.parse(data.toString());
  } catch {
    return [];
  }
}

export default async function Page() {
  const rewards = await getRewards();
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Recompensas</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircledIcon className="me-2" /> Nova Recompensa
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Nova Recompensa</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <NewRewardForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <RewardsDataTable data={rewards} />
    </>
  );
}


