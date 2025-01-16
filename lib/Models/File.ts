import { object as zobject, string as zstring, infer as zinfer } from "zod";

const FileDataSchema = zobject({
    data: zstring().url(),
});

type FileData = zinfer<typeof FileDataSchema>;

export {
    FileDataSchema,
    FileData
}