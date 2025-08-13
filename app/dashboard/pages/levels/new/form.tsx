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

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  level_number: z.coerce.number().int(),
  min_points: z.coerce.number().int(),
  max_points: z.coerce.number().int()
});

export default function NewLevelForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", level_number: 1, min_points: 0, max_points: 0 }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("level_number", String(values.level_number));
      formData.append("min_points", String(values.min_points));
      formData.append("max_points", String(values.max_points));
      const res = await fetch("/api/levels", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (e) {
      alert("Erro ao salvar nível");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Nível</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Platinum" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField control={form.control} name="level_number" render={({ field }) => (
                <FormItem>
                  <FormLabel>Level do Nível</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div>
              <FormField control={form.control} name="min_points" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos mínimos</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div>
              <FormField control={form.control} name="max_points" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos máximos</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}


