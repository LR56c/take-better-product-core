import { z } from 'zod';

export const PriceHistorySchema = z.object({
    id: z.string().uuid(),
    product_id: z.string().uuid(),
    price: z.number(),
    recorded_at: z.string().datetime(),
});

export type PriceHistoryResponse = z.infer<typeof PriceHistorySchema>;
