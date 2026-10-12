import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/app/footer";
import { Navbar } from "@/components/app/navbar";
import { getBreadcrumbJsonLd, JsonLd } from "@/components/seo/jsonLd";
import { url } from "@/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how ApexTools collects, uses, and protects your personal information.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const breadcrumbs = [
  { name: "Home", item: url },
  { name: "Privacy Policy", item: `${url}/privacy-policy` },
];

export default function PrivacyPolicy() {
  return (
    <Navbar>
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <article className="section">
        <h1>Privacy Policy</h1>
        <p>Last updated: October 2026</p>

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
          We use essential cookies for authentication. These cookies are
          required for the website to function properly.
        </p>
        <p>
          We also use cookies and similar technologies for analytics (Umami)
          and advertising (Google AdSense).
        </p>

        <h2>Advertising</h2>
        <p>
          We use Google AdSense to display ads on ApexTools. Third-party
          vendors, including Google, use cookies to serve ads based on a
          user&apos;s prior visits to this website or other websites.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables it and its partners
          to serve ads to users based on their visit to this site and/or other
          sites on the Internet.
        </p>
        <p>
          Users may opt out of personalized advertising by visiting{" "}
          <Link
            href="https://www.google.com/settings/ads"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </Link>
          . Alternatively, you can opt out of some third-party vendors&apos;
          use of cookies for personalized advertising by visiting{" "}
          <Link
            href="https://www.aboutads.info"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.aboutads.info
          </Link>
          .
        </p>
        <p>
          Learn more about{" "}
          <Link
            href="https://policies.google.com/technologies/partner-sites"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            how Google uses data when you use our partners&apos; sites or apps
          </Link>
          .
        </p>
        <p>
          Visitors in the European Economic Area, the UK, and Switzerland will
          see a consent message for ads cookies where required. You can manage
          those choices through the consent options shown on the site.
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
          We do not sell, trade, or rent your personal information. We share
          data with service providers that help us operate the site, including
          authentication providers, email delivery, analytics, and Google
          AdSense for serving ads. We may also share data when required by law
          or to protect our rights.
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
