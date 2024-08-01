import { z } from "zod";

const FileDataSchema = z.object({
    data: z.string().url(),
});

type FileData = z.infer<typeof FileDataSchema>;

export {
    FileDataSchema,
    FileData
}