import { promises as fs } from "fs";
import path from "path";

import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import BackofficeDataTable from "./data-table";
import { generateMeta } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewBackofficeForm from "./new/form";

export async function generateMetadata() {
  return generateMeta({
    title: "Backoffice - Shadcn UI Kit Free",
    description: "A list of influencers (backoffice) created using the Tanstack Table.",
    canonical: "/pages/backoffice"
  });
}

async function getBackoffice() {
  const data = await fs.readFile(path.join(process.cwd(), "app/dashboard/pages/backoffice/data.json"));
  return JSON.parse(data.toString());
}

export default async function Page() {
  const users = await getBackoffice();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Backoffice</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircledIcon className="me-2" /> Novo Usuário Backoffice
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Novo Usuário Backoffice</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <NewBackofficeForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <BackofficeDataTable data={users} />
    </>
  );
}


