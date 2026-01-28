import { z } from 'zod';

export const StoreCategorySchema = z.object({
    id: z.uuid(),
    store_id: z.string(),
    category_id: z.string(),
    url: z.string().nullable(),
    is_active: z.boolean(),
});

export type StoreCategoryDTO = z.infer<typeof StoreCategorySchema>;
