"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { createMission, type MissionCreatePayload } from "@/lib/missionService";
import { ImageUpload } from "@/components/ui/image-upload";

const formSchema = z.object({
  id: z.coerce.number().int().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  image_base64: z.string().min(1, "Imagem é obrigatória"),
  image_url: z.string().default("http://www.globo.com"),
  points: z.coerce.number().int().min(1, "Pontos devem ser maior que 0"),
  type: z.enum(["review", "photo", "video", "hashtag", "indication"], { required_error: "Selecione um tipo" }),
  status: z.enum(["new", "active", "closed", "canceled"], { required_error: "Selecione um status" }),
  deadline: z.date({ required_error: "Data de prazo é obrigatória" }),
  highlighted: z.boolean().default(false),
  briefing_objective: z.string().min(1, "Objetivo é obrigatório"),
  briefing_target_audience: z.string().min(1, "Público alvo é obrigatório"),
  briefing_main_message: z.string().min(1, "Mensagem principal é obrigatória"),
  briefing_value_proposition: z.string().min(1, "Proposta de valor é obrigatória"),
  instructions: z.string().min(1, "Instruções são obrigatórias"),
  required_hashtags: z.string().min(1, "Hashtags obrigatórias são obrigatórias")
});

export default function NewMissionForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Data padrão: hoje + 30 dias
  const defaultDeadline = addDays(new Date(), 30);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image_base64: "",
      image_url: "http://www.globo.com",
      points: 0,
      highlighted: false,
      deadline: defaultDeadline,
      briefing_objective: "",
      briefing_target_audience: "",
      briefing_main_message: "",
      briefing_value_proposition: "",
      instructions: "",
      required_hashtags: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);

      // validações obrigatórias para todos os campos
      const requiredErrors: Array<{ field: keyof z.infer<typeof formSchema>; label: string }> = [];
      
      if (!values.title?.trim()) requiredErrors.push({ field: "title", label: "Título" });
      if (!values.description?.trim()) requiredErrors.push({ field: "description", label: "Descrição" });
      if (!values.image_base64?.trim()) requiredErrors.push({ field: "image_base64", label: "URL da Imagem" });
      if (!values.points || values.points <= 0) requiredErrors.push({ field: "points", label: "Pontos" });
      if (!values.type) requiredErrors.push({ field: "type", label: "Tipo" });
      if (!values.status) requiredErrors.push({ field: "status", label: "Status" });
      if (!values.deadline) requiredErrors.push({ field: "deadline", label: "Prazo Final" });
      if (!values.briefing_objective?.trim()) requiredErrors.push({ field: "briefing_objective", label: "Objetivo" });
      if (!values.briefing_target_audience?.trim()) requiredErrors.push({ field: "briefing_target_audience", label: "Público Alvo" });
      if (!values.briefing_main_message?.trim()) requiredErrors.push({ field: "briefing_main_message", label: "Mensagem Principal" });
      if (!values.briefing_value_proposition?.trim()) requiredErrors.push({ field: "briefing_value_proposition", label: "Proposta de Valor" });
      if (!values.instructions?.trim()) requiredErrors.push({ field: "instructions", label: "Instruções" });
      if (!values.required_hashtags?.trim()) requiredErrors.push({ field: "required_hashtags", label: "Hashtags Obrigatórias" });

      if (requiredErrors.length) {
        // Mostra toast com todos os campos obrigatórios
        const errorMessage = `Campos obrigatórios: ${requiredErrors.map(err => err.label).join(", ")}`;
        toast.error(errorMessage);
        
        // Marca os campos como inválidos para mostrar labels vermelhos
        setTimeout(() => {
          requiredErrors.forEach((err) => {
            form.setError(err.field as any, { type: "required" });
          });
        }, 0);
        
        return;
      }

      const toStringArray = (input?: string) =>
        input
          ? input
              .split(/\r?\n|,/)
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined;

      const payload: MissionCreatePayload = {
        title: values.title,
        description: values.description!,
        image_base64: values.image_base64!,
        image_url: values.image_url!,
        points: values.points!,
        type: values.type!,
        status: values.status!,
        deadline: values.deadline!.toISOString(),
        highlighted: values.highlighted ?? false,
        briefing_objective: values.briefing_objective!,
        briefing_target_audience: values.briefing_target_audience!,
        briefing_main_message: values.briefing_main_message!,
        briefing_value_proposition: values.briefing_value_proposition!,
        instructions: toStringArray(values.instructions!),
        required_hashtags: toStringArray(values.required_hashtags!)
      };

      await createMission(payload);
      toast.success("Missão criada com sucesso!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar missão externa");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <hr/>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="id" render={({ field }) => <input type="hidden" {...field} />} />
        <div className="space-y-6">
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.title && "text-destructive")}>
                    Título da missão *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Título" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-1 xl:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.description && "text-destructive")}>
                    Descrição resumida da missão *
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="image_base64"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.image_base64 && "text-destructive")}>
                    Imagem da missão (banner) *
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecione uma imagem para a missão"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1">
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    URL da imagem
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled 
                      placeholder="http://www.globo.com"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(form.formState.errors.type && "text-destructive")}>
                      Tipo da missão *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="review">review</SelectItem>
                        <SelectItem value="photo">photo</SelectItem>
                        <SelectItem value="video">video</SelectItem>
                        <SelectItem value="hashtag">hashtag</SelectItem>
                        <SelectItem value="indication">indication</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div>
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
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">new</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(form.formState.errors.points && "text-destructive")}>
                      Pontos *
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="highlighted"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mb-0">Destaque</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={cn(form.formState.errors.deadline && "text-destructive")}>
                    Prazo final *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button type="button" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "LLL dd, y") : <span>Escolher data</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
          <hr />
          <FormLabel>Breafing</FormLabel>
          <div className="xl:col-span-2 md:col-span-1 col-span-1">
            <FormField
              control={form.control}
              name="briefing_objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.briefing_objective && "text-destructive")}>
                    Objetivo *
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Objetivo da missão" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="xl:col-span-2 md:col-span-1 col-span-1">
            <FormField
              control={form.control}
              name="briefing_target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.briefing_target_audience && "text-destructive")}>
                    Público Alvo *
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Público alvo da missão" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="xl:col-span-2 md:col-span-1 col-span-1">
            <FormField
              control={form.control}
              name="briefing_main_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.briefing_main_message && "text-destructive")}>
                    Mensagem Principal *
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Mensagem principal da missão" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="xl:col-span-2 md:col-span-1 col-span-1">
            <FormField
              control={form.control}
              name="briefing_value_proposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.briefing_value_proposition && "text-destructive")}>
                    Proposta de Valor *
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Proposta de valor da missão" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="xl:col-span-2 md:col-span-1 col-span-1">
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.instructions && "text-destructive")}>
                    Instruções *
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Instruções da missão (uma por linha ou separadas por vírgula)" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="xl:col-span-2 md:col-span-1 col-span-1">
            <FormField
              control={form.control}
              name="required_hashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(form.formState.errors.required_hashtags && "text-destructive")}>
                    Hashtags Obrigatórias *
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Hashtags obrigatórias (uma por linha ou separadas por vírgula)" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="w-full" type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}


// Quando não for destaque não tem foto
// quando destaque obrigatório


// na instrução tem que ser no formato lista

