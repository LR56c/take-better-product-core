import { z } from 'zod';

export const ProductEmbeddingSchema = z.object({
    id: z.string().uuid(),
    product_id: z.string().uuid(),
});

export type ProductEmbeddingResponse = z.infer<typeof ProductEmbeddingSchema>;
