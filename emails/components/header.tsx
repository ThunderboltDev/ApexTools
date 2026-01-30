import { Img, Section, Text } from "@react-email/components";
import { brand, styles } from "@/emails/config";

type EmailHeaderProps = {
  title: string;
};

export function EmailHeader({ title }: EmailHeaderProps) {
  return (
    <Section style={styles.header}>
      <Img
        src={brand.logoUrl}
        alt={brand.name}
        width={72}
        height={72}
        style={styles.logo}
      />
      <Text style={styles.title}>{title}</Text>
    </Section>
  );
}
