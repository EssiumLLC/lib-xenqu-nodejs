import { z } from "zod";

export const FileUploadResponse = z.object({
  chunkSeq: z.number(),
  chunkStart: z.number(),
  chunkEnd: z.number(),
  chunkSize: z.number(),
  chunkLimit: z.number(),
  totalSize: z.number(),
  totalChunks: z.number(),
  fileHandle: z.string(),
});

export type FileUploadResponseType = z.infer<typeof FileUploadResponse>;
