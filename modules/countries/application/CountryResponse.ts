import { z } from 'zod';

export const CountrySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string().length(3),
    currency: z.string().length(3),
});

export type CountryResponse = z.infer<typeof CountrySchema>;
