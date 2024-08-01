import { z } from "zod";

const PolicySchema = z.object({
    site_profile: z.string(),
    security_actions: z.array(
        z.object({
            type: z.string(),
            message: z.string(),
            block: z.boolean(),
            data: z.object({})
        })
    )
});

type Policy = z.infer<typeof PolicySchema>;

export { Policy, PolicySchema };