import { z } from "zod"

export const subCategorySchema = z.object( {
  id        : z.string(),
  name        : z.string({
    message: "El nombre de la sub categoría es obligatorio",
  }),
  clinic_id : z.string({
    message: "El ID de la clínica es obligatorio",
  }),
  category_id: z.string({
    message: "El ID de la categoría es obligatorio",
  }),
  created_at: z.iso.datetime().default( new Date().toISOString() )
} )

export type SubCategoryDTO = z.infer<typeof subCategorySchema>
