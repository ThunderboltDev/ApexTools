import { Hr, Section, Text } from "@react-email/components";
import { format } from "date-fns";
import { EmailLayout } from "@/emails/components/layout";
import { brand, styles } from "@/emails/config";

type Props = {
  toolName: string;
  featuredUntil: Date;
  duration: number;
};

export default function FeaturedActivatedEmail({
  toolName,
  featuredUntil,
  duration,
}: Props) {
  const durationText = duration === 7 ? "1 week" : `${duration / 7} weeks`;

  return (
    <EmailLayout
      preview={`🎉 ${toolName} is now featured on ${brand.name}!`}
      headerTitle="Your Tool is Featured!"
    >
      <Section>
        <Text style={styles.paragraph}>
          Great news! <strong>{toolName}</strong> is now featured on{" "}
          {brand.name} for {durationText}.
        </Text>
      </Section>

      <Section
        style={{
          backgroundColor: "#f0fdf4",
          borderRadius: "12px",
          padding: "20px",
          margin: "24px 0",
        }}
      >
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#166534",
            margin: 0,
            textAlign: "center" as const,
          }}
        >
          Featured until {format(featuredUntil, "MMMM d, yyyy")}
        </Text>
      </Section>

      <Section>
        <Text style={styles.paragraph}>
          <strong>What this means for your tool:</strong>
        </Text>
        <Text
          style={{
            ...styles.paragraph,
            paddingLeft: "16px",
            textAlign: "left" as const,
          }}
        >
          ✓ Appears first in all search results
          <br />
          ✓ Featured badge displayed on your listing
          <br />✓ Up to 10x more visibility
        </Text>
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

FeaturedActivatedEmail.PreviewProps = {
  toolName: "Apex SEO Analyzer",
  featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  duration: 7,
} satisfies Props;
