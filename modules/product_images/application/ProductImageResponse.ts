import { z } from 'zod';

export const ProductImageSchema = z.object({
    id: z.string().uuid(),
    product_id: z.string().uuid(),
    image_url: z.string(),
    main: z.boolean(),
});

export type ProductImageResponse = z.infer<typeof ProductImageSchema>;
