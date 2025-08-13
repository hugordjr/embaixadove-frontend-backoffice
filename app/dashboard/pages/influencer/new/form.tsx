"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  nickname: z.string().optional(),
  photo: z.any().optional(),
  description: z.string().optional(),
  level_name: z.enum(["Bronze", "Silver", "Gold", "Platinum", "Diamond"], { required_error: "Selecione um nível" }),
  level_number: z.coerce.number().int({ message: "Número inválido" }),
  current_points: z.coerce.number().int().default(0),
  missions_completed_count: z.coerce.number().int().default(0),
  ranking: z.coerce.number().int().default(0),
  is_brand: z.boolean().default(false),
  affiliate_link_url: z.string().url("URL inválida").optional().or(z.literal("").transform(() => undefined))
});

export default function NewInfluencerForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nickname: "",
      photo: undefined,
      description: "",
      level_name: undefined as unknown as z.infer<typeof formSchema>["level_name"],
      level_number: 1,
      current_points: 0,
      missions_completed_count: 0,
      ranking: 0,
      is_brand: false,
      affiliate_link_url: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.nickname) formData.append("nickname", values.nickname);
      if (values.description) formData.append("description", values.description);
      formData.append("level_name", values.level_name);
      formData.append("level_number", String(values.level_number));
      formData.append("current_points", String(values.current_points ?? 0));
      formData.append("missions_completed_count", String(values.missions_completed_count ?? 0));
      formData.append("ranking", String(values.ranking ?? 0));
      formData.append("is_brand", String(values.is_brand ?? false));
      if (values.affiliate_link_url) formData.append("affiliate_link_url", values.affiliate_link_url);
      if (values.photo instanceof File) formData.append("photo", values.photo);

      const res = await fetch("/api/influencers", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar influenciador");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="col-span-1">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="col-span-1">
            <FormField control={form.control} name="nickname" render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname</FormLabel>
                <FormControl>
                  <Input placeholder="apelido público" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="col-span-1">
            <FormField control={form.control} name="photo" render={({ field }) => (
              <FormItem>
                <FormLabel>Foto</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Bio/descrição</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Fale sobre o influenciador..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField control={form.control} name="level_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div>
              <FormField control={form.control} name="current_points" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos acumulados</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div>
              <FormField control={form.control} name="missions_completed_count" render={({ field }) => (
                <FormItem>
                  <FormLabel>Total de missões concluídas</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div>
              <FormField control={form.control} name="ranking" render={({ field }) => (
                <FormItem>
                  <FormLabel>Posição no ranking</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div>
              <FormField control={form.control} name="affiliate_link_url" render={({ field }) => (
                <FormItem>
                  <FormLabel>Link de afiliado</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div>
              <FormField control={form.control} name="is_brand" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Representa a marca?</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="text-sm text-muted-foreground">Ex.: Equipe Dove</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

          </div>
       
       
        </div>
        <div className="flex gap-3">
          <Button className="w-full" type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}


