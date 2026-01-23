import { z } from 'zod';

export const StoreCategorySchema = z.object({
    id: z.string().uuid(),
    storeId: z.string(),
    categoryId: z.string(),
    url: z.string().nullable(),
    isActive: z.boolean(),
});

export type StoreCategoryDTO = z.infer<typeof StoreCategorySchema>;
