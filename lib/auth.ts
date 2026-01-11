import { render } from "@react-email/render";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { url } from "@/config";
import { db } from "@/db/index";
import { schema } from "@/db/schema";
import { brand } from "@/emails/config";
import MagicLinkEmail from "@/emails/magic-link";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  appName: "ApexTools",
  baseURL: url,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ url: magicLinkUrl, email }) => {
        const emailHtml = await render(
          MagicLinkEmail({ url: magicLinkUrl }) as ReactElement
        );

        const emailText = await render(
          MagicLinkEmail({ url: magicLinkUrl }) as ReactElement,
          { plainText: true }
        );

        await resend.emails.send({
          from: `"${brand.name}" <${
            process.env.RESEND_FROM_EMAIL || "noreply@apextools.com"
          }>`,
          to: email,
          subject: `Sign in to ${brand.name}`,
          html: emailHtml,
          text: emailText,
        });
      },
      expiresIn: 60 * 60,
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  onAPIError: {
    errorURL: "/auth",
  },
});
