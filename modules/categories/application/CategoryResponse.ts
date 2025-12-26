import { z } from 'zod';

export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    parent_id: z.string().uuid().nullable(),
});

export type CategoryResponse = z.infer<typeof CategorySchema>;
