import { z } from "zod"

export const ProductImageSchema = z.object( {
  id       : z.string().uuid().optional(),
  url      : z.string().url(),
  product_id: z.string().uuid().optional()
} )

export type ProductImageDTO = z.infer<typeof ProductImageSchema>
