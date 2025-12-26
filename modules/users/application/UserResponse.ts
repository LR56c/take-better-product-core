import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().nullable(),
    role: z.string(),
});

export type UserResponse = z.infer<typeof UserSchema>;
