import { z } from "zod";

const OAuth1CredentialsSchema = z.object({
  consumer_key: z.string(),
  consumer_secret: z.string(),
  token: z.string(),
  token_secret: z.string(),
});

type OAuth1Credentials = z.infer<typeof OAuth1CredentialsSchema>;

export { OAuth1Credentials, OAuth1CredentialsSchema };