"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Influencer = {
  id: number;
  name: string;
  photo_url?: string;
  nickname?: string;
  description?: string;
  level_name: string;
  level_number: number;
  current_points: number;
  missions_completed_count: number;
  ranking: number;
  is_brand: boolean;
  affiliate_link_url?: string;
};

const mockData: Influencer[] = [
  {
    id: 1,
    name: "Ana Carvalho",
    nickname: "anacarvalho",
    photo_url: "/images/avatars/1.png",
    description: "Criadora de conteúdo de skincare.",
    level_name: "Gold",
    level_number: 3,
    current_points: 1200,
    missions_completed_count: 18,
    ranking: 5,
    is_brand: false,
    affiliate_link_url: "https://meulink.bio/ana"
  },
  {
    id: 2,
    name: "Bruno Lima",
    nickname: "brlimma",
    photo_url: "/images/avatars/2.png",
    description: "Lifestyle e bem-estar.",
    level_name: "Platinum",
    level_number: 4,
    current_points: 2500,
    missions_completed_count: 32,
    ranking: 2,
    is_brand: false,
    affiliate_link_url: "https://meulink.bio/bruno"
  },
  {
    id: 3,
    name: "Equipe Dove",
    nickname: "doveoficial",
    photo_url: "/images/avatars/3.png",
    description: "Perfil oficial da marca.",
    level_name: "Diamond",
    level_number: 5,
    current_points: 9999,
    missions_completed_count: 100,
    ranking: 1,
    is_brand: true,
    affiliate_link_url: "https://dove.com/br"
  },
  {
    id: 4,
    name: "Carla Mendes",
    nickname: "carlamnds",
    photo_url: "/images/avatars/4.png",
    description: "Maquiagem e moda.",
    level_name: "Silver",
    level_number: 2,
    current_points: 540,
    missions_completed_count: 9,
    ranking: 14,
    is_brand: false,
    affiliate_link_url: ""
  },
  {
    id: 5,
    name: "Diego Rocha",
    nickname: "diegor",
    photo_url: "/images/avatars/5.png",
    description: "Cuidados pessoais para homens.",
    level_name: "Bronze",
    level_number: 1,
    current_points: 220,
    missions_completed_count: 4,
    ranking: 28,
    is_brand: false,
    affiliate_link_url: "https://meulink.bio/diego"
  }
];

export default function BackofficeDataTable({ data }: { data: Influencer[] }) {
  const tableData = React.useMemo<Influencer[]>(() => (data && data.length ? data : mockData), [data]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loadingStates, setLoadingStates] = React.useState<Record<number, boolean>>({});
  const router = useRouter();

  // Função para navegar para edição
  const handleEdit = (influencerId: number) => {
    router.push(`/dashboard/pages/influencer/${influencerId}`);
  };

  // Função para deletar influenciador
  const handleDelete = async (influencerId: number) => {
    if (!confirm(`Remover influenciador #${influencerId}?`)) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, [influencerId]: true }));
      const res = await fetch(`/api/influencers?id=${influencerId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (e) {
      alert("Falha ao remover influenciador");
    } finally {
      setLoadingStates(prev => ({ ...prev, [influencerId]: false }));
    }
  };

  const columns: ColumnDef<Influencer>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => row.getValue("id")
    },
    
    {
      accessorKey: "name",
      header: "Influenciador",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={row.original.photo_url || "/images/avatars/1.png"} alt="Influenciador" />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            {row.original.nickname ? (
              <div className="text-xs text-muted-foreground">@{row.original.nickname}</div>
            ) : null}
          </div>
        </div>
      )
    },
    {
      accessorKey: "level_name",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("level_name")
    },
    {
      accessorKey: "level_number",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Level #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("level_number")
    },
    {
      accessorKey: "current_points",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Pontos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("current_points")
    },
    {
      accessorKey: "missions_completed_count",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Missões
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("missions_completed_count")
    },
    {
      accessorKey: "ranking",
      header: ({ column }) => (
        <Button className="-ml-3" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ranking
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("ranking")
    },
    {
      accessorKey: "is_brand",
      header: "Marca",
      cell: ({ row }) => {
        const isBrand = row.original.is_brand;
        return (
          <Badge
            className={cn("capitalize", {
              "bg-blue-100 text-blue-700 hover:bg-blue-100": isBrand,
              "bg-gray-100 text-gray-700 hover:bg-gray-100": !isBrand
            })}
          >
            {isBrand ? "Sim" : "Não"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "affiliate_link_url",
      header: "Afiliado",
      cell: ({ row }) => {
        const url = row.original.affiliate_link_url;
        if (!url) return "-";
        return (
          <a className="text-primary underline" href={url} target="_blank" rel="noreferrer">
            {url.length > 24 ? url.slice(0, 24) + "…" : url}
          </a>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const influencer = row.original as Influencer;
        const isLoading = loadingStates[influencer.id] || false;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(influencer.id)}>Ver/Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(influencer.id)}>Excluir</DropdownMenuItem>
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar por nome..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Input
            placeholder="Buscar por nickname..."
            value={(table.getColumn("nickname")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("nickname")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="me-2 h-4 w-4" /> Department
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <Command>
                <CommandInput placeholder="Department" className="h-9" />
                <CommandList>
                  <CommandEmpty>No department found.</CommandEmpty>
                  <CommandGroup>
                    {departments.map((dep) => (
                      <CommandItem key={dep.value} value={dep.value} onSelect={() => table.getColumn("department")?.setFilterValue(dep.value)}>
                        <div className="py-1">{dep.label}</div>
                      </CommandItem>
                    ))}
                    <CommandItem value="__all_deps" onSelect={() => table.getColumn("department")?.setFilterValue("")}>
                      <div className="py-1">Clear</div>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="me-2 h-4 w-4" /> Position
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <Command>
                <CommandInput placeholder="Position" className="h-9" />
                <CommandList>
                  <CommandEmpty>No position found.</CommandEmpty>
                  <CommandGroup>
                    {positions.map((pos) => (
                      <CommandItem key={pos.value} value={pos.value} onSelect={() => table.getColumn("position_title")?.setFilterValue(pos.value)}>
                        <div className="py-1">{pos.label}</div>
                      </CommandItem>
                    ))}
                    <CommandItem value="__all_pos" onSelect={() => table.getColumn("position_title")?.setFilterValue("")}>
                      <div className="py-1">Clear</div>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover> */}
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
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
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


