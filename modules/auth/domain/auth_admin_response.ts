import { z } from "zod"

export const authAdminResponseSchema = z.object( {
  id   : z.string(),
  token: z.string()
} )

export type AuthAdminResponse = z.infer<typeof authAdminResponseSchema>
