import { promises as fs } from "fs";
import path from "path";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import CouponsDataTable from "./table";
import { generateMeta } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NewCouponForm from "./new/form";

export async function generateMetadata() {
  return generateMeta({
    title: "Cupons",
    description: "Lista de cupons",
    canonical: "/dashboard/pages/coupons"
  });
}

async function getCoupons() {
  const dataFile = path.join(process.cwd(), "data", "coupons.json");
  try {
    const data = await fs.readFile(dataFile);
    return JSON.parse(data.toString());
  } catch {
    return [];
  }
}

export default async function Page() {
  const coupons = await getCoupons();
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Cupons</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircledIcon className="me-2" /> Novo Cupom
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Novo Cupom</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <NewCouponForm />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <CouponsDataTable data={coupons} />
    </>
  );
}


