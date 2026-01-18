import { z }                   from "zod"
import {
  ProductSchema
}                              from "../../products/application/product_response"

export const productEmbeddingResponseSchema = z.object( {
  id        : z.string(),
  product   : ProductSchema,
  content   : z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullish(),
} )

export type ProductEmbeddingResponse = z.infer<typeof productEmbeddingResponseSchema>
