import { z } from "zod"


export const querySchema = z
  .looseObject( {
    limit    : z.coerce.number().nullish(),
    skip     : z.string().nullish(),
    sort_by  : z.string().nullish(),
    sort_type: z.string().nullish()
  } )
  .transform( ( { limit, skip, sort_type, sort_by, ...rest } ) => (
    {
      limit,
      skip,
      sort_type,
      sort_by,
      query: rest
    }
  ) )

export type QueryDTO = z.infer<typeof querySchema>
