import { z }                   from "zod"
import { EmbeddingStatusEnum } from "../domain/embedding_status"
import {
  ProductSchema
}                              from "../../products/application/product_response"

export const productEmbeddingResponseSchema = z.object( {
  id        : z.string(),
  product   : ProductSchema,
  content   : z.string(),
  status    : z.enum(EmbeddingStatusEnum),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullish(),
  reasoning : z.string().nullish(),
  candidates: z.array( ProductSchema )
} )

export type ProductEmbeddingResponse = z.infer<typeof productEmbeddingResponseSchema>
