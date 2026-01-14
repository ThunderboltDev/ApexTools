import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/app/footer";
import { Navbar } from "@/components/app/navbar";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms and conditions for using the ApexTools AI directory.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfService() {
  return (
    <Navbar>
      <article className="section">
        <h1>Terms of Service</h1>
        <p>Last updated: January 2026</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using ApexTools, you agree to be bound by these Terms
          of Service. If you do not agree to these terms, please do not use our
          service.
        </p>

        <h2>Description of Service</h2>
        <p>
          ApexTools is an AI tools directory that helps users discover and
          explore artificial intelligence tools and services. We aggregate
          information about third-party AI tools and provide a platform for
          users to browse, search, and submit tool listings.
        </p>

        <h2>User Accounts</h2>
        <p>
          To submit tools or access certain features, you may need to create an
          account. You are responsible for:
        </p>
        <ul>
          <li>Maintaining the confidentiality of your account</li>
          <li>All activities that occur under your account</li>
          <li>Providing accurate and complete information</li>
        </ul>

        <h2>User-Submitted Content</h2>
        <p>When submitting tool listings, you agree that:</p>
        <ul>
          <li>You have the right to submit information about the tool</li>
          <li>The information provided is accurate and not misleading</li>
          <li>Your submission does not infringe on any third-party rights</li>
          <li>
            You grant us a non-exclusive license to display and distribute the
            submitted content
          </li>
        </ul>

        <h2>Third-Party Tools</h2>
        <p>
          ApexTools is a directory service. We do not own, operate, or control
          the third-party AI tools listed on our platform. We are not
          responsible for:
        </p>
        <ul>
          <li>The accuracy of information provided by tool creators</li>
          <li>The functionality or availability of listed tools</li>
          <li>Any damages resulting from your use of third-party tools</li>
          <li>The privacy practices or terms of service of listed tools</li>
        </ul>

        <h2>Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Submit false or misleading information</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Interfere with the proper functioning of the service</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use the service for any illegal or harmful purpose</li>
        </ul>

        <h2>Disclaimer of Warranties</h2>
        <p>
          ApexTools is provided &ldquo;as is&rdquo; without any warranties,
          express or implied. We do not guarantee the accuracy, completeness, or
          usefulness of any information on this site.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, ApexTools shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of the service.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use
          of the service after changes constitutes acceptance of the new terms.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about these Terms of Service, please contact us
          at{" "}
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
