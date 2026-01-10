import { z } from "zod"

export const ProductImageSchema = z.object( {
  id       : z.uuid().optional(),
  url      : z.url(),
  product_id: z.uuid().optional()
} )

export type ProductImageDTO = z.infer<typeof ProductImageSchema>
