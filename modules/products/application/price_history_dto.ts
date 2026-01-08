import { z } from "zod"

export const PriceHistorySchema = z.object( {
  id        : z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  price     : z.number(),
  currency  : z.string().length( 3 ),
  date      : z.date().or( z.string() )
} )

export type PriceHistoryDTO = z.infer<typeof PriceHistorySchema>
