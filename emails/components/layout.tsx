import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { brand, styles } from "@/emails/config";
import { EmailHeader } from "./header";

type EmailLayoutProps = {
  preview: string;
  headerTitle: string;
  children: React.ReactNode;
  showFooter?: boolean;
};

export function EmailLayout({
  preview,
  headerTitle,
  children,
  showFooter = true,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>

      <Body style={styles.body}>
        <Container style={styles.card}>
          <EmailHeader title={headerTitle} />
          {children}
        </Container>

        {showFooter && (
          <Container style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} {brand.name}. All rights reserved.
            </Text>
          </Container>
        )}
      </Body>
    </Html>
  );
}
