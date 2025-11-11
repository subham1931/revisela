import { z } from 'zod';
import { ClassPublicAccessLevel } from '../schemas/class.schema';
export declare const createClassSchema: z.ZodObject<{
    name: z.ZodString;
    orgName: z.ZodString;
    publicAccess: z.ZodDefault<z.ZodEnum<[ClassPublicAccessLevel.NONE, ClassPublicAccessLevel.RESTRICTED, ClassPublicAccessLevel.VIEW_ONLY, ClassPublicAccessLevel.EDIT]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    publicAccess: ClassPublicAccessLevel;
    orgName: string;
}, {
    name: string;
    orgName: string;
    publicAccess?: ClassPublicAccessLevel | undefined;
}>;
export type CreateClassDto = z.infer<typeof createClassSchema>;
