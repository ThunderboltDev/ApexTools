import { Button, Hr, Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/layout";
import { brand, styles } from "@/emails/config";

type Props = {
  url: string;
};

export default function MagicLinkEmail({ url }: Props) {
  return (
    <EmailLayout
      preview={`Sign in to ${brand.name}`}
      headerTitle={`Sign In to ${brand.name}`}
    >
      <Section>
        <Text style={styles.paragraph}>
          Click the button below to sign in to your account. This link will
          expire in 15 minutes.
        </Text>
      </Section>

      <Section style={styles.buttonContainer}>
        <Button href={url} style={styles.button}>
          Sign In
        </Button>
      </Section>

      <Section>
        <Text style={styles.muted}>
          Or copy and paste this link into your browser:
        </Text>
        <Link href={url} style={styles.link}>
          {url}
        </Link>
      </Section>

      <Hr style={styles.divider} />

      <Section>
        <Text style={styles.securityTitle}>Security Notice</Text>
        <Text style={styles.securityText}>
          This link expires in 15 minutes.
          <br />
          If you didn't request this, you can safely ignore the email.
        </Text>
      </Section>
    </EmailLayout>
  );
}

MagicLinkEmail.PreviewProps = {
  url: "https://apextools.site/auth/magic?token=1234567890",
} satisfies Props;
