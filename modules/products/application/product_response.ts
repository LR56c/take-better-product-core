import { z } from 'zod';

export const ProductSchema = z.object({
    id: z.uuid(),
    store_id: z.uuid(),
    brand_id: z.uuid().nullable(),
    category_id: z.uuid().nullable(),
    external_id: z.string(),
    url: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    currency: z.string().length(3),
    // additional_data: z.record(z.any()).nullable(),
    additional_data: z.json().nullable()
});

export type ProductResponse = z.infer<typeof ProductSchema>;
