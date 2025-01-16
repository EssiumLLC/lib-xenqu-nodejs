import { string as zstring, object as zobject, infer as zinfer } from "zod";

const OAuth1CredentialsSchema = zobject({
  consumer_key: zstring(),
  consumer_secret: zstring(),
  token: zstring(),
  token_secret: zstring(),
});

type OAuth1Credentials = zinfer<typeof OAuth1CredentialsSchema>;

export { OAuth1Credentials, OAuth1CredentialsSchema };