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
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusCircle, Edit } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

export type Mission = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  points: number;
  type: "review" | "photo" | "video" | "hashtag" | "indication";
  status: "new" | "active" | "closed" | "canceled";
  deadline?: string;
  highlighted: boolean;
  briefing_objective?: string;
  briefing_target_audience?: string;
  briefing_main_message?: string;
  briefing_value_proposition?: string;
  instructions?: string[];
  required_hashtags?: string[];
};

interface MissionsDataTableProps {
  data: Mission[];
  onEditMission: (mission: Mission) => void;
}

export default function MissionsDataTable({ data, onEditMission }: MissionsDataTableProps) {
  const tableData = React.useMemo<Mission[]>(() => (Array.isArray(data) ? data : []), [data]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Definir colunas dentro do componente para ter acesso ao onEditMission
  const columns: ColumnDef<Mission>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => row.getValue("id")
    },
    {
      accessorKey: "title",
      header: "Título da Missão",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.image_url || "/images/cover.png"} alt={String(row.getValue("title"))} />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue("title")}</div>
        </div>
      )
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("type")
    },
    {
      accessorKey: "points",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Pontos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("points")
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prazo Final
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("deadline") as string | undefined;
        if (!value) return "-";
        const d = new Date(value);
        return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        const base = "capitalize";
        if (status === "active") {
          return <Badge className={cn(base, "bg-green-100 text-green-700 hover:bg-green-100")}>{status}</Badge>;
        }
        if (status === "new") {
          return <Badge className={cn(base, "bg-blue-100 text-blue-700 hover:bg-blue-100")}>{status}</Badge>;
        }
        if (status === "closed") {
          return <Badge className={cn(base, "bg-gray-100 text-gray-700 hover:bg-gray-100")}>{status}</Badge>;
        }
        if (status === "canceled") {
          return <Badge className={cn(base, "bg-red-100 text-red-700 hover:bg-red-100")}>{status}</Badge>;
        }
        return <span className="capitalize">{status}</span>;
      }
    },
    {
      accessorKey: "highlighted",
      header: "Destaque",
      cell: ({ row }) => (row.getValue("highlighted") ? <Badge className="bg-yellow-100 text-yellow-700">Sim</Badge> : 
        <Badge className="bg-gray-100 text-gray-700">Não</Badge>)
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditMission(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
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

  const statuses = [
    { value: "new", label: "new" },
    { value: "active", label: "active" },
    { value: "closed", label: "closed" },
    { value: "canceled", label: "canceled" }
  ];

  const types = [
    { value: "review", label: "review" },
    { value: "photo", label: "photo" },
    { value: "video", label: "video" },
    { value: "hashtag", label: "hashtag" },
    { value: "indication", label: "indication" }
  ];

  return (
    <div className="w-full">
      {/*<div className="flex items-center gap-4 py-4">
         <div className="flex gap-2">
          <Input
            placeholder="Search missions..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="me-2 h-4 w-4" /> Status
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0">
              <Command>
                <CommandInput placeholder="Status" className="h-9" />
                <CommandList>
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem key={status.value} value={status.value}>
                        <div className="flex items-center space-x-3 py-1">
                          <Checkbox id={`st-${status.value}`} />
                          <label htmlFor={`st-${status.value}`} className="leading-none">
                            {status.label}
                          </label>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="me-2 h-4 w-4" /> Type
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0">
              <Command>
                <CommandInput placeholder="Type" className="h-9" />
                <CommandList>
                  <CommandEmpty>No type found.</CommandEmpty>
                  <CommandGroup>
                    {types.map((t) => (
                      <CommandItem key={t.value} value={t.value}>
                        <div className="flex items-center space-x-3 py-1">
                          <Checkbox id={`tp-${t.value}`} />
                          <label htmlFor={`tp-${t.value}`} className="leading-none">
                            {t.label}
                          </label>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
      </div>*/}
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}


