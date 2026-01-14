import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/app/footer";
import { Navbar } from "@/components/app/navbar";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how ApexTools collects, uses, and protects your personal information.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  return (
    <Navbar>
      <article className="section">
        <h1>Privacy Policy</h1>
        <p>Last updated: January 2026</p>

        <h2>Information We Collect</h2>
        <p>
          ApexTools collects minimal information necessary to provide our
          services:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you create an account, we
            collect your email address and authentication details from your
            chosen provider (Google, GitHub, or email).
          </li>
          <li>
            <strong>Usage Data:</strong> We use Umami Analytics to collect
            anonymous, aggregated usage data to improve our service. This does
            not include personally identifiable information.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use essential cookies only for authentication purposes. These
          cookies are required for the website to function properly and cannot
          be disabled. We do not use cookies for advertising or tracking.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and maintain your account</li>
          <li>Allow you to submit and manage tool listings</li>
          <li>Improve our directory and user experience</li>
          <li>Send important service-related notifications</li>
        </ul>

        <h2>Data Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third
          parties. We may share data only when required by law or to protect our
          rights.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal
          information. However, no method of transmission over the Internet is
          100% secure.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of your data</li>
          <li>Request deletion of your account</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{" "}
          <Link href="mailto:support@thunderboltdev.site" className="link">
            support@thunderboltdev.site
          </Link>
          .
        </p>
      </article>
      <Footer />
    </Navbar>
  );
}
