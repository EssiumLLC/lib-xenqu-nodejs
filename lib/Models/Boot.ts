import { z } from "zod";

const BootProfileSchema = z.object({
    _id: z.string(),
    profile_name: z.string(),
    app_labels: z.object({
        brand_name_short: z.string(),
        brand_name_long: z.string(),
    }),
    web_site: z.string().url(),
    api_urls: z.array(z.string().url()),
    openid_providers: z.array(z.object({
        id: z.string(),
        label: z.string(),
        button_img: z.string().url(),
        authority: z.string().url(),
        client_id: z.string(),
        response_type: z.string(),
        scope: z.string(),
        redirect_uri: z.string().url().nullable(),
        replacement_data: z.object({}).optional(),
        replacement_map: z.object({}).optional(),
        allows_custom_tenant: z.boolean().nullable(),
        request_replacement_data: z.object({}).nullable(),
        client_lookup: z.string().nullable(),
        metadata: z.object({
            issuer: z.string().url(),
            authorization_endpoint: z.string().url(),
            userinfo_endpoint: z.string().url(),
            end_session_endpoint: z.string().url(),
            jwks_uri: z.string().url(),
        }),
    })),
});

const BootProviderSchema = z.object({
    id: z.string(),
    label: z.string(),
    button_img: z.string().url(),
    authority: z.string().url(),
    client_id: z.string(),
    response_type: z.string(),
    scope: z.string(),
    redirect_uri: z.string().url().nullable(),
    replacement_data: z.object({}).optional(),
    replacement_map: z.object({}).optional(),
    allows_custom_tenant: z.boolean().nullable(),
    request_replacement_data: z.object({}).nullable(),
    client_lookup: z.string().nullable(),
    metadata: z.object({
        issuer: z.string().url(),
        authorization_endpoint: z.string().url(),
        userinfo_endpoint: z.string().url(),
        end_session_endpoint: z.string().url(),
        jwks_uri: z.string().url(),
    }),
});

const BootSchema = z.object({
    _m: z.string(),
    _s: z.string(),
    _p: BootProfileSchema,
    _o: z.array(BootProviderSchema),
});

type BootProfile = z.infer<typeof BootProfileSchema>;
type BootProvider = z.infer<typeof BootProviderSchema>;
type Boot = z.infer<typeof BootSchema>;

export { Boot, BootProfile, BootProvider, BootSchema, BootProfileSchema, BootProviderSchema };