import { z } from 'zod';

export const BrandSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

export type BrandResponse = z.infer<typeof BrandSchema>;
