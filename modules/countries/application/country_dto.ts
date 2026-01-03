import { z } from "zod"

export const countrySchema = z.object( {
  id  : z.string(),
  name: z.string(),
  code: z.string(),
  currency: z.string(),
} )

export type CountryDTO = z.infer<typeof countrySchema>
