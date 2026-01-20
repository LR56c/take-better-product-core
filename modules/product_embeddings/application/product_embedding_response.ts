import { z } from "zod"

export const productEmbeddingResponseSchema = z.object( {
  id        : z.string(),
  product_id        : z.string(),
  content   : z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullish(),
} )

export type ProductEmbeddingResponse = z.infer<typeof productEmbeddingResponseSchema>
