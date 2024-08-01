import { z } from 'zod';

const ContactSchema = z.object({
  _id: z.string(),
  contact_id: z.number(),
  display_name: z.string(),
  primary_email: z.string().email(),
  update_date: z.string().datetime(),
  update_id: z.number(),
  create_date: z.string().datetime(),
  create_id: z.number(),
  owner_id: z.number(),
  profile_image: z.string(),
  archive: z.boolean(),
  emails: z.array(z.object({
    order: z.number(),
    usage: z.string(),
    address: z.string().email(),
  })),
  phones: z.array(z.object({
    order: z.number(),
    usage: z.string(),
    format: z.string(),
    number: z.string(),
  })),
  addresses: z.array(z.object({
    order: z.number(),
    usage: z.string(),
    street1: z.string(),
    street2: z.string().optional(),
    street3: z.string().optional(),
    region1: z.string(),
    region2: z.string(),
    postalcode: z.string(),
    country: z.string(),
    valid_from: z.string().optional(),
    valid_to: z.string().optional(),
  })),
  org_name: z.string().optional(),
  title: z.string().optional(),
  first_name: z.string(),
  last_name: z.string(),
  tags: z.array(z.string()).optional(),
  socialLinks: z.array(z.string()).optional(),
  primary_phone: z.string().optional(),
  locale: z.string(),
  salutation: z.string().optional(),
  middle_name: z.string().optional(),
  name_suffix: z.string().optional(),
  nick_name: z.string().optional(),
  job_title: z.string().optional(),
  notes: z.string().optional(),
  owned_by: z.lazy(() => ContactSchema),
  created_by: z.lazy(() => ContactSchema),
  changed_by: z.lazy(() => ContactSchema),
});

const PortalSetupSchema = z.object({
  branding_image_id: z.string(),
  custom_primary_color: z.string(),
  custom_link: z.object({
    link: z.string().url(),
    title: z.string(),
  }),
  palette: z.null(),
  clear_branding: z.boolean(),
  tab_layouts: z.array(z.unknown()),
  tracking_group_ids: z.array(z.unknown()),
  email_address: z.string().optional(),
  brand_name: z.string().optional(),
  domain_name: z.string().optional(),
  custom_text_color: z.string().nullable(),
  _temp_handle_id: z.string(),
  content_type: z.string(),
  file_id: z.string(),
});

const SetupSigoptsSchema = z.object({
  allowed: z.object({
    text: z.boolean(),
    image: z.boolean(),
    pen: z.boolean(),
  }),
});

const AccountSchema = z.object({
  _id: z.string(),
  account_name: z.string(),
  mail_account: z.string(),
  site_profile: z.string(),
  verify_mail: z.object({
    status: z.string(),
  }),
  integrations: z.array(z.string()),
  license_id: z.string(),
  type: z.string(),
  status: z.string(),
  status_date: z.string().datetime(),
  settings: z.object({
    licensed_accounts: z.string(),
    enhanced_users: z.string(),
    create_content: z.boolean(),
    share_library: z.boolean(),
    form_builder: z.boolean(),
    api_access: z.boolean(),
    custom_email_domain: z.boolean(),
    enable_dashboard: z.boolean(),
    configure_dashboard: z.boolean(),
    is_admin: z.boolean(),
    is_developer: z.boolean(),
  }),
  create_id: z.number(),
  create_date: z.string().datetime(),
  security_policies: z.array(z.unknown()),
  config: z.object({
    tab_definitions: z.array(z.object({
      id: z.string(),
      account_id: z.string().nullable(),
      name: z.string(),
      item_type: z.string(),
      icon: z.string(),
      primary_filter: z.string(),
      primary_filter_definition_id: z.string().nullable(),
      is_default: z.boolean(),
      tab_layout: z.array(z.unknown()),
      order: z.number(),
      show_layout_titles: z.boolean(),
      filters: z.array(z.unknown()),
      show_progressbar: z.boolean(),
      search_query: z.array(z.unknown()),
      search_preferences: z.array(z.object({
        title: z.string(),
        id: z.string(),
        nested: z.boolean(),
        default: z.boolean().optional(),
      })),
    })),
  }),
});

const UserInfoSchema = z.object({
  contact: ContactSchema,
  portal_setup: PortalSetupSchema,
  setup_sigopts: SetupSigoptsSchema,
  account: AccountSchema,
});

type UserInfo = z.infer<typeof UserInfoSchema>;

export { UserInfo, UserInfoSchema };
