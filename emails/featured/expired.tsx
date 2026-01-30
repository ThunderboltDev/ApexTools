import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/layout";
import { brand, styles, url } from "@/emails/config";

type Props = {
  toolName: string;
  toolSlug: string;
};

export default function FeaturedExpiredEmail({ toolName, toolSlug }: Props) {
  return (
    <EmailLayout
      preview={`Your featured listing for "${toolName}" has expired`}
      headerTitle="Featured Listing Expired"
    >
      <Section>
        <Text style={styles.paragraph}>
          Your featured listing for <strong>{toolName}</strong> has expired.
          Your tool will no longer appear first in search results or display the
          featured badge.
        </Text>
      </Section>

      <Section>
        <Text style={styles.paragraph}>
          <strong>Want to continue getting more visibility?</strong>
        </Text>
        <Text
          style={{
            ...styles.paragraph,
            paddingLeft: "16px",
            textAlign: "left" as const,
          }}
        >
          <span>✓ Appear first in all search results</span>
          <br />
          <span>✓ Get the featured badge on your listing</span>
          <br />
          <span>✓ Get up to 10x more views</span>
        </Text>
      </Section>

      <Section style={styles.buttonContainer}>
        <Button href={`${url}/tool/${toolSlug}`} style={styles.button}>
          Feature Your Tool Again
        </Button>
      </Section>

      <Hr style={styles.divider} />

      <Section>
        <Text style={styles.muted}>
          Thank you for featuring your tool on {brand.name}!
        </Text>
      </Section>
    </EmailLayout>
  );
}

FeaturedExpiredEmail.PreviewProps = {
  toolName: "Apex SEO Analyzer",
  toolSlug: "apex-seo-analyzer",
} satisfies Props;
