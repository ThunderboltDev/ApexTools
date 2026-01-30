import { Button, Hr, Section, Text } from "@react-email/components";
import { format } from "date-fns";
import { EmailLayout } from "@/emails/components/layout";
import { brand, styles, url } from "@/emails/config";

type Props = {
  toolName: string;
  toolSlug: string;
  expiresAt: Date;
};

export default function FeaturedExpiringEmail({
  toolName,
  toolSlug,
  expiresAt,
}: Props) {
  return (
    <EmailLayout
      preview={`Your featured listing for "${toolName}" expires in 3 days`}
      headerTitle="⏰ Featured Listing Expiring Soon"
    >
      <Section>
        <Text style={styles.paragraph}>
          Your featured listing for <strong>{toolName}</strong> will expire on{" "}
          <strong>{format(expiresAt, "MMMM d, yyyy")}</strong> (in 3 days).
        </Text>
      </Section>

      <Section
        style={{
          backgroundColor: "#fef3c7",
          borderRadius: "12px",
          padding: "20px",
          margin: "24px 0",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            color: "#92400e",
            margin: 0,
            textAlign: "center" as const,
          }}
        >
          Don't lose your visibility! Extend your featured listing to keep
          appearing first in search results.
        </Text>
      </Section>

      <Section style={styles.buttonContainer}>
        <Button href={`${url}/tool/${toolSlug}`} style={styles.button}>
          Extend Featured Listing
        </Button>
      </Section>

      <Hr style={styles.divider} />

      <Section>
        <Text style={styles.muted}>
          You're receiving this because you have an active featured listing on{" "}
          {brand.name}.
        </Text>
      </Section>
    </EmailLayout>
  );
}

FeaturedExpiringEmail.PreviewProps = {
  toolName: "Apex SEO Analyzer",
  toolSlug: "apex-seo-analyzer",
  expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
} satisfies Props;
