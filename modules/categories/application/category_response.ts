import { z } from 'zod';
import {
    subCategorySchema
} from "../../sub_category/application/sub_category_dto"

export const CategorySchema = z.object({
    id: z.uuid(),
    name: z.string(),
    slug: z.string(),
    sub_categories: z.array(subCategorySchema),
    created_at: z.iso.datetime().default( new Date().toISOString() )
});

export type CategoryResponse = z.infer<typeof CategorySchema>;
