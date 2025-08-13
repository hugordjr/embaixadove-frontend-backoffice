"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Influencer = { id: number; name: string; nickname?: string };

const formSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  description: z.string().optional(),
  category: z.string().optional(),
  valid_until: z.string().optional(),
  max_uses: z.coerce.number().int(),
  current_uses: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
  affiliate_user_id: z.coerce.number().int().optional()
});

export default function NewCouponForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {
    fetch("/api/influencers")
      .then((r) => r.json())
      .then((list) => setInfluencers(list))
      .catch(() => setInfluencers([]));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      description: "",
      category: "",
      valid_until: "",
      max_uses: 1,
      current_uses: 0,
      active: true,
      affiliate_user_id: undefined
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("code", values.code);
      if (values.description) formData.append("description", values.description);
      if (values.category) formData.append("category", values.category);
      if (values.valid_until) formData.append("valid_until", values.valid_until);
      formData.append("max_uses", String(values.max_uses));
      formData.append("current_uses", String(values.current_uses ?? 0));
      formData.append("active", String(values.active));
      if (values.affiliate_user_id) formData.append("affiliate_user_id", String(values.affiliate_user_id));

      const res = await fetch("/api/coupons", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar cupom");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="col-span-1">
            <FormField control={form.control} name="code" render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="DOVE10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="col-span-1">
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Haircare" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="col-span-1">
            <FormField control={form.control} name="valid_until" render={({ field }) => (
              <FormItem>
                <FormLabel>Validade (YYYY-MM-DD)</FormLabel>
                <FormControl>
                  <Input placeholder="2025-12-31" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="col-span-1">
            <FormField control={form.control} name="active" render={({ field }) => (
              <FormItem>
                <FormLabel>Ativo</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField control={form.control} name="max_uses" render={({ field }) => (
                <FormItem>
                  <FormLabel>Máximo de usos permitidos</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div>
              <FormField control={form.control} name="current_uses" render={({ field }) => (
                <FormItem>
                  <FormLabel>Contagem atual de usos</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Detalhes do cupom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <FormField control={form.control} name="affiliate_user_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Influencer</FormLabel>
                <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value ? String(field.value) : undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o influenciador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {influencers.map((inf) => (
                      <SelectItem key={inf.id} value={String(inf.id)}>
                        {inf.name} {inf.nickname ? `(@${inf.nickname})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="w-full" type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}


