import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/app/footer";
import { Navbar } from "@/components/app/navbar";
import { getBreadcrumbJsonLd, JsonLd } from "@/components/seo/jsonLd";
import { socials, url } from "@/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the ApexTools team for support, listings, or feedback.",
  alternates: {
    canonical: "/contact",
  },
};

const breadcrumbs = [
  { name: "Home", item: url },
  { name: "Contact", item: `${url}/contact` },
];

export default function Contact() {
  return (
    <Navbar>
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <article className="section">
        <h1>Contact</h1>
        <p>
          ApexTools is operated by Thunderbolt. Use the details below to reach
          us about listings, account issues, or this website.
        </p>

        <h2>Email</h2>
        <p>
          <Link href={`mailto:${socials.email}`} className="link">
            {socials.email}
          </Link>
        </p>

        <h2>Elsewhere</h2>
        <ul>
          <li>
            <Link
              href={socials.twitter}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              X / Twitter
            </Link>
          </li>
          <li>
            <Link
              href={socials.github}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </li>
        </ul>

        <h2>Tool listings</h2>
        <p>
          To add a tool to the directory, use the{" "}
          <Link href="/submit" className="link">
            submit form
          </Link>
          . For an existing listing, sign in and manage it from your dashboard.
        </p>
      </article>
      <Footer />
    </Navbar>
  );
}
