"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FormWrapper from "./new/form-wrapper";
import EditFormWrapper from "./edit/form-wrapper";
import ErrorToast from "./error-toast";
import MissionsDataTable, { type Mission } from "./data-table";
import { getMission } from "@/lib/missionService";

export const dynamic = "force-dynamic";

export default function Page() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // Função para buscar missões
  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await getMission({ page: 1, limit: 50 });
      console.log('Resposta completa da API:', response);
      
      // Extrair os items da resposta da API
      const missionsData = response?.items || response || [];
      console.log('Dados das missões extraídos:', missionsData);
      
      setMissions(missionsData);
    } catch (error) {
      console.error("Erro ao buscar missões:", error);
      setHasError(true);
      setMissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para abrir edição
  const handleEditMission = (mission: Mission) => {
    setEditingMission(mission);
    setIsEditSheetOpen(true);
  };

  // Função para fechar edição
  const handleCloseEdit = () => {
    setIsEditSheetOpen(false);
    setEditingMission(null);
  };

  // Função para sucesso na edição
  const handleEditSuccess = () => {
    fetchMissions(); // Recarrega os dados
    handleCloseEdit();
  };

  // Buscar missões na montagem do componente
  useEffect(() => {
    // Proteção contra múltiplas chamadas
    let mounted = true;
    
    if (mounted) {
      fetchMissions();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {hasError && <ErrorToast />}
      
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Missões</h2>
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Missão
              </Button>
            </SheetTrigger>
            <SheetContent className="max-w-[90vw] w-[1400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Nova Missão</SheetTitle>
                <SheetDescription>
                  Preencha os dados para criar uma nova missão.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FormWrapper />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Modal de Edição */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="max-w-[90vw] w-[1400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editar Missão</SheetTitle>
            <SheetDescription>
              Atualize os dados da missão selecionada.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            {editingMission && (
              <EditFormWrapper
                mission={editingMission}
                onClose={handleCloseEdit}
                onSuccess={handleEditSuccess}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <div className="mt-8">
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <MissionsDataTable data={missions} onEditMission={handleEditMission} />
        )}
      </div>
    </>
  );
}


