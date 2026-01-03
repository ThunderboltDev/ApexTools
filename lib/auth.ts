import { render } from "@react-email/render";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { url } from "@/config";
import { brand } from "@/emails/config";
import MagicLinkEmail from "@/emails/magic-link";
import { db } from "@/index";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseURL: url,
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
          from: `"${brand.name}" <${process.env.RESEND_FROM_EMAIL || "noreply@apexaura.com"}>`,
          to: email,
          subject: `Sign in to ${brand.name}`,
          html: emailHtml,
          text: emailText,
        });
      },
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
});
