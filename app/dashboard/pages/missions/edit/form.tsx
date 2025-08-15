"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateMission, MissionUpdatePayload } from "@/lib/missionService";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  image_base64: z.string().min(1, "URL da imagem é obrigatória"),
  points: z.number().min(1, "Pontos devem ser pelo menos 1"),
  type: z.string().min(1, "Tipo é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  deadline: z.date({
    required_error: "Data limite é obrigatória",
  }),
  highlighted: z.boolean(),
  briefing_objective: z.string().min(1, "Objetivo do briefing é obrigatório"),
  briefing_target_audience: z.string().min(1, "Público-alvo é obrigatório"),
  briefing_main_message: z.string().min(1, "Mensagem principal é obrigatória"),
  briefing_value_proposition: z.string().min(1, "Proposta de valor é obrigatória"),
  instructions: z.string().min(1, "Instruções são obrigatórias"),
  required_hashtags: z.string().min(1, "Hashtags são obrigatórias"),
});

interface EditMissionFormProps {
  mission: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditMissionForm({ mission, onClose, onSuccess }: EditMissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: mission.title || "",
      description: mission.description || "",
      image_base64: mission.image_base64 || "",
      points: mission.points || 100,
      type: mission.type || "",
      status: mission.status || "",
      deadline: mission.deadline ? new Date(mission.deadline) : addDays(new Date(), 30),
      highlighted: mission.highlighted || false,
      briefing_objective: mission.briefing_objective || "",
      briefing_target_audience: mission.briefing_target_audience || "",
      briefing_main_message: mission.briefing_main_message || "",
      briefing_value_proposition: mission.briefing_value_proposition || "",
      instructions: Array.isArray(mission.instructions) ? mission.instructions.join("\n") : mission.instructions || "",
      required_hashtags: Array.isArray(mission.required_hashtags) ? mission.required_hashtags.join("\n") : mission.required_hashtags || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.errors && Object.keys(form.formState.errors).length > 0) {
      const errorFields = Object.keys(form.formState.errors)
        .map(field => {
          const fieldName = field as keyof typeof form.formState.errors;
          const error = form.formState.errors[fieldName];
          return error?.message;
        })
        .filter(Boolean)
        .join(", ");

      toast.error(`Campos obrigatórios não preenchidos: ${errorFields}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar payload para o backend
      const payload: MissionUpdatePayload = {
        title: values.title,
        description: values.description,
        image_base64: values.image_base64,
        points: values.points,
        type: values.type,
        status: values.status,
        deadline: values.deadline.toISOString(),
        highlighted: values.highlighted,
        briefing_objective: values.briefing_objective,
        briefing_target_audience: values.briefing_target_audience,
        briefing_main_message: values.briefing_main_message,
        briefing_value_proposition: values.briefing_value_proposition,
        instructions: values.instructions.split("\n").filter(instruction => instruction.trim() !== ""),
        required_hashtags: values.required_hashtags.split("\n").filter(hashtag => hashtag.trim() !== ""),
      };

      await updateMission(mission.id, payload);
      
      toast.success("Missão atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar missão:", error);
      toast.error("Erro ao atualizar missão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {/* Título */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(form.formState.errors.title && "text-destructive")}>
                  Título *
                </FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título da missão" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Descrição */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(form.formState.errors.description && "text-destructive")}>
                  Descrição *
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Digite a descrição da missão" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* URL da Imagem */}
          <FormField
            control={form.control}
            name="image_base64"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(form.formState.errors.image_base64 && "text-destructive")}>
                  URL da Imagem *
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Pontos */}
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(form.formState.errors.points && "text-destructive")}>
                  Pontos *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Tipo */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(form.formState.errors.type && "text-destructive")}>
                  Tipo *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn(form.formState.errors.status && "text-destructive")}>
                  Status *
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">Nova</SelectItem>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Data Limite */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={cn(form.formState.errors.deadline && "text-destructive")}>
                  Data Limite *
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {/* Destaque */}
          <FormField
            control={form.control}
            name="highlighted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Destaque</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Marcar como missão em destaque
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Seção de Briefing */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Briefing</h3>
          
          <div className="space-y-6">
            {/* Objetivo */}
            <FormField
              control={form.control}
              name="briefing_objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.briefing_objective && "text-destructive")}>
                    Objetivo *
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Qual o objetivo desta missão?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Público-alvo */}
            <FormField
              control={form.control}
              name="briefing_target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.briefing_target_audience && "text-destructive")}>
                    Público-alvo *
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Quem é o público-alvo?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Mensagem Principal */}
            <FormField
              control={form.control}
              name="briefing_main_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.briefing_main_message && "text-destructive")}>
                    Mensagem Principal *
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Qual a mensagem principal?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Proposta de Valor */}
            <FormField
              control={form.control}
              name="briefing_value_proposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.briefing_value_proposition && "text-destructive")}>
                    Proposta de Valor *
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Qual o valor para o usuário?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Seção de Instruções e Hashtags */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Instruções e Hashtags</h3>
          
          <div className="space-y-6">
            {/* Instruções */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.instructions && "text-destructive")}>
                    Instruções *
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite as instruções (uma por linha)"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Hashtags Obrigatórias */}
            <FormField
              control={form.control}
              name="required_hashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.required_hashtags && "text-destructive")}>
                    Hashtags Obrigatórias *
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite as hashtags (uma por linha)"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Atualizando..." : "Atualizar Missão"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
