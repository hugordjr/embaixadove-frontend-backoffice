"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type Coupon = {
  id: number;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  validFrom: string;
  validUntil: string;
  maxUses: number;
  currentUses: number;
  active: boolean;
  description?: string;
};

const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: "WELCOME20",
    discount: 20,
    type: "percentage",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    maxUses: 1000,
    currentUses: 150,
    active: true,
    description: "Desconto de 20% para novos usuários"
  },
  {
    id: 2,
    code: "SAVE50",
    discount: 50,
    type: "fixed",
    validFrom: "2024-01-01",
    validUntil: "2024-06-30",
    maxUses: 500,
    currentUses: 75,
    active: true,
    description: "Desconto fixo de R$ 50"
  },
  {
    id: 3,
    code: "SUMMER30",
    discount: 30,
    type: "percentage",
    validFrom: "2024-06-01",
    validUntil: "2024-08-31",
    maxUses: 2000,
    currentUses: 1200,
    active: false,
    description: "Desconto de verão"
  }
];

export default function CouponsDataTable({ data }: { data: Coupon[] }) {
  const tableData = React.useMemo<Coupon[]>(() => (data && data.length ? data : mockCoupons), [data]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Função para navegar para a página de edição
  const handleEditCoupon = (couponId: number) => {
    // Usar window.location ou router.push aqui se necessário
    window.location.href = `/dashboard/pages/coupons/${couponId}`;
  };

  const columns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => row.getValue("id")
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("code")}</div>
    },
    {
      accessorKey: "discount",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Desconto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <div className="font-medium">
            {coupon.type === "percentage" ? `${coupon.discount}%` : `R$ ${coupon.discount}`}
          </div>
        );
      }
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge className={cn("capitalize", type === "percentage" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
            {type === "percentage" ? "Percentual" : "Fixo"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "validFrom",
      header: "Válido de",
      cell: ({ row }) => {
        const date = new Date(row.getValue("validFrom"));
        return date.toLocaleDateString("pt-BR");
      }
    },
    {
      accessorKey: "validUntil",
      header: "Válido até",
      cell: ({ row }) => {
        const date = new Date(row.getValue("validUntil"));
        return date.toLocaleDateString("pt-BR");
      }
    },
    {
      accessorKey: "maxUses",
      header: "Usos máximos",
      cell: ({ row }) => row.getValue("maxUses")
    },
    {
      accessorKey: "currentUses",
      header: "Usos atuais",
      cell: ({ row }) => row.getValue("currentUses")
    },
    {
      accessorKey: "active",
      header: "Ativo",
      cell: ({ row }) => {
        const active = row.getValue("active") as boolean;
        return (
          <Badge className={cn("capitalize", active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>{
            active ? "Sim" : "Não"
          }</Badge>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const coupon = row.original as Coupon;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditCoupon(coupon.id)}>
                Ver/Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection }
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar por código..."
            value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("code")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}


