import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "../ui/badge";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center mt-5 mb-5 font-bold", className)}>
      <img src="/embaixadove-logo.png" style={{ width: "200px;" }} className="block" alt="Embaixadover" />
    </Link>
  );
}
