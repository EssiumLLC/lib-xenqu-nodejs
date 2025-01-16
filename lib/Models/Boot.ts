import { object as zobject, string as zstring, array as zarray, boolean as zboolean, infer as zinfer } from "zod";

const BootProfileSchema = zobject({
    _id: zstring(),
    profile_name: zstring(),
    app_labels: zobject({
        brand_name_short: zstring(),
        brand_name_long: zstring(),
    }),
    web_site: zstring().url(),
    api_urls: zarray(zstring().url()),
    openid_providers: zarray(zobject({
        id: zstring(),
        label: zstring(),
        button_img: zstring().url(),
        authority: zstring().url(),
        client_id: zstring(),
        response_type: zstring(),
        scope: zstring(),
        redirect_uri: zstring().url().nullable(),
        replacement_data: zobject({}).optional(),
        replacement_map: zobject({}).optional(),
        allows_custom_tenant: zboolean().nullable(),
        request_replacement_data: zobject({}).nullable(),
        client_lookup: zstring().nullable(),
        metadata: zobject({
            issuer: zstring().url(),
            authorization_endpoint: zstring().url(),
            userinfo_endpoint: zstring().url(),
            end_session_endpoint: zstring().url(),
            jwks_uri: zstring().url(),
        }),
    })),
});

const BootProviderSchema = zobject({
    id: zstring(),
    label: zstring(),
    button_img: zstring().url(),
    authority: zstring().url(),
    client_id: zstring(),
    response_type: zstring(),
    scope: zstring(),
    redirect_uri: zstring().url().nullable(),
    replacement_data: zobject({}).optional(),
    replacement_map: zobject({}).optional(),
    allows_custom_tenant: zboolean().nullable(),
    request_replacement_data: zobject({}).nullable(),
    client_lookup: zstring().nullable(),
    metadata: zobject({
        issuer: zstring().url(),
        authorization_endpoint: zstring().url(),
        userinfo_endpoint: zstring().url(),
        end_session_endpoint: zstring().url(),
        jwks_uri: zstring().url(),
    }),
});

const BootSchema = zobject({
    _m: zstring(),
    _s: zstring(),
    _p: BootProfileSchema,
    _o: zarray(BootProviderSchema),
});

type BootProfile = zinfer<typeof BootProfileSchema>;
type BootProvider = zinfer<typeof BootProviderSchema>;
type Boot = zinfer<typeof BootSchema>;

export { Boot, BootProfile, BootProvider, BootSchema, BootProfileSchema, BootProviderSchema };