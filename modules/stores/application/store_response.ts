import { z } from 'zod';
import { countrySchema } from "../../countries/application/country_dto"
import { StoreCategorySchema } from "./store_category_dto"

export const StoreTypeSchema = z.enum(['supermarket', 'pharmacy', 'technology', 'clothes', 'pets', 'library']);

export const StoreSchema = z.object({
    id: z.uuid(),
    country: countrySchema,
    name: z.string(),
    url: z.string().nullable(),
    thumbnail: z.string().nullable(),
    type: StoreTypeSchema,
    categories: z.array(StoreCategorySchema)
});

export type StoreResponse = z.infer<typeof StoreSchema>;
export type StoreType = z.infer<typeof StoreTypeSchema>;
