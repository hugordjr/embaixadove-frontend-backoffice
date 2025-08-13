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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Influencer = { id: number; name: string; nickname?: string };

const formSchema = z.object({
  author_id: z.coerce.number().int(),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  media: z.any().optional(),
  type: z.string().optional(),
  posted_at: z.string().optional(),
  likes_count: z.coerce.number().int().default(0),
  comments_count: z.coerce.number().int().default(0)
});

export default function NewPostForm() {
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
      author_id: undefined as unknown as number,
      content: "",
      media: undefined,
      type: "",
      posted_at: "",
      likes_count: 0,
      comments_count: 0
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("author_id", String(values.author_id));
      formData.append("content", values.content);
      if (values.type) formData.append("type", values.type);
      if (values.posted_at) formData.append("posted_at", values.posted_at);
      formData.append("likes_count", String(values.likes_count ?? 0));
      formData.append("comments_count", String(values.comments_count ?? 0));
      if (values.media instanceof File) formData.append("media", values.media);

      const res = await fetch("/api/posts", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">

          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Escreva o conteúdo do post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Hashtags</FormLabel>
                <FormControl>

                  <Input type="text"  />

                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="col-span-1">
            <FormField control={form.control} name="media" render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*,video/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                </FormControl>
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


