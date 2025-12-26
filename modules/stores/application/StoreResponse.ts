import { z } from 'zod';

export const StoreTypeSchema = z.enum(['supermarket', 'pharmacy', 'technology', 'clothes', 'pets', 'library']);

export const StoreSchema = z.object({
    id: z.string().uuid(),
    country_id: z.string().uuid(),
    name: z.string(),
    url: z.string().nullable(),
    thumbnail: z.string().nullable(),
    type: StoreTypeSchema,
});

export type StoreResponse = z.infer<typeof StoreSchema>;
export type StoreType = z.infer<typeof StoreTypeSchema>;
