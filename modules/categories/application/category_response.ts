import { z } from 'zod';

export const CategorySchema = z.object({
    id: z.uuid(),
    name: z.string(),
    slug: z.string(),
    parent_id: z.uuid().nullable(),
});

export type CategoryResponse = z.infer<typeof CategorySchema>;
