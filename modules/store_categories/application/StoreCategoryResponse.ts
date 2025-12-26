import { z } from 'zod';

export const StoreCategorySchema = z.object({
    id: z.string().uuid(),
    store_id: z.string().uuid(),
    category_id: z.string().uuid(),
    url: z.string(),
    is_active: z.boolean(),
});

export type StoreCategoryResponse = z.infer<typeof StoreCategorySchema>;
