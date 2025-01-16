import { object as zobject, string as zstring, array as zarray, boolean as zboolean, infer as zinfer } from "zod";

const PolicySchema = zobject({
    site_profile: zstring(),
    security_actions: zarray(
        zobject({
            type: zstring(),
            message: zstring(),
            block: zboolean(),
            data: zobject({})
        })
    )
});

type Policy = zinfer<typeof PolicySchema>;

export { Policy, PolicySchema };