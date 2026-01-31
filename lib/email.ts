import { render } from "@react-email/render";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { brand } from "@/emails/config";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailTemplate = ReactElement;

interface SendEmailOptions {
  to: string;
  subject: string;
  template: EmailTemplate;
}

export async function sendEmail({ to, subject, template }: SendEmailOptions) {
  const emailHtml = await render(template);
  const emailText = await render(template, { plainText: true });

  return resend.emails.send({
    from: `"${brand.name}" <${process.env.RESEND_FROM_EMAIL}>`,
    to,
    subject,
    html: emailHtml,
    text: emailText,
  });
}
