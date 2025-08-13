"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { format } from "date-fns";

const formSchema = z.object({
  id: z.coerce.number().int().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  image: z.any().optional(),
  points: z.coerce.number().int().min(0).default(0),
  type: z.enum(["review", "photo", "video", "hashtag", "indication"], { required_error: "Selecione um tipo" }),
  status: z.enum(["new", "active", "closed", "canceled"], { required_error: "Selecione um status" }),
  deadline: z.date().optional(),
  highlighted: z.boolean().default(false),
  briefing_objective: z.string().optional(),
  briefing_target_audience: z.string().optional(),
  briefing_main_message: z.string().optional(),
  briefing_value_proposition: z.string().optional(),
  instructions: z.string().optional(),
  required_hashtags: z.string().optional()
});

export default function NewMissionForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      points: 0,
      highlighted: false,
      type: undefined,
      status: undefined
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      const formData = new FormData();
      if (values.id != null) formData.append("id", String(values.id));
      formData.append("title", values.title);
      if (values.description) formData.append("description", values.description);
      formData.append("points", String(values.points ?? 0));
      if (values.type) formData.append("type", values.type);
      if (values.status) formData.append("status", values.status);
      if (values.deadline) formData.append("deadline", values.deadline.toISOString());
      formData.append("highlighted", String(values.highlighted ?? false));
      if (values.briefing_objective) formData.append("briefing_objective", values.briefing_objective);
      if (values.briefing_target_audience) formData.append("briefing_target_audience", values.briefing_target_audience);
      if (values.briefing_main_message) formData.append("briefing_main_message", values.briefing_main_message);
      if (values.briefing_value_proposition) formData.append("briefing_value_proposition", values.briefing_value_proposition);
      if (values.instructions) formData.append("instructions", values.instructions);
      if (values.required_hashtags) formData.append("required_hashtags", values.required_hashtags);

      const imageList = (form.getValues("image") as FileList | undefined) || undefined;
      const imageFile = imageList && imageList.length > 0 ? imageList[0] : undefined;
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/missions", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar missão");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="id" render={({ field }) => <input type="hidden" {...field} />} />
        <div className="space-y-6">
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da missão</FormLabel>
                  <FormControl>
                    <Input placeholder="Título" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>Descrição resumida da missão</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Banner da missão</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => form.setValue("image", e.target.files as unknown as any)} />
                  </FormControl>
                  <FormMessage />
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
                    <FormLabel>Tipo da missão</FormLabel>
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
                    <FormMessage />
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
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">new</SelectItem>
                        <SelectItem value="active">active</SelectItem>
                        <SelectItem value="closed">closed</SelectItem>
                        <SelectItem value="canceled">canceled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                    <FormLabel>Pontos</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
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
                  <FormLabel>Prazo final</FormLabel>
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
                  <FormMessage />
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
                  <FormLabel>Objetivo</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>Público Alvo</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>Mensagem Principal</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>Proposta de Valor</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel>Instruções</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
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

