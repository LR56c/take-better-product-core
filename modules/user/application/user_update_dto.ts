import { z } from "zod"

export const userUpdateSchema = z.object( {
  id  : z.string(),
  role: z.string().nullish()
} )


export type UserUpdateDTO = z.infer<typeof userUpdateSchema>
