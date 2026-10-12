import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/app/footer";
import { Navbar } from "@/components/app/navbar";
import { getBreadcrumbJsonLd, JsonLd } from "@/components/seo/jsonLd";
import { socials, url } from "@/config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn who runs ApexTools and how we curate the AI tools directory.",
  alternates: {
    canonical: "/about",
  },
};

const breadcrumbs = [
  { name: "Home", item: url },
  { name: "About", item: `${url}/about` },
];

export default function About() {
  return (
    <Navbar>
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <article className="section">
        <h1>About ApexTools</h1>
        <p>
          ApexTools is a curated directory of AI tools for productivity,
          marketing, development, writing, research, and creative work. The
          goal is to help people find reliable tools quickly, without wading
          through noisy lists or outdated roundups.
        </p>

        <h2>What we publish</h2>
        <p>
          Each listing includes a description, categories, tags, and links so
          you can evaluate a tool before visiting it. Category pages add
          editorial context and FAQs. Anyone can submit a tool, and verified
          owners can claim and update their listing.
        </p>

        <h2>Who runs this site</h2>
        <p>
          ApexTools is built and maintained by{" "}
          <Link
            href="https://www.thunderboltdev.site/?ref=apextools.site"
            className="link"
          >
            Thunderbolt
          </Link>
          , an independent software engineer. It is a real, actively maintained
          product and not a placeholder or parked domain.
        </p>

        <h2>Advertising</h2>
        <p>
          We may show ads through Google AdSense to help keep the directory
          free to use. Ads are labeled by the ad network. See the{" "}
          <Link href="/privacy-policy" className="link">
            Privacy Policy
          </Link>{" "}
          for how advertising cookies work.
        </p>

        <h2>Get in touch</h2>
        <p>
          Questions, corrections, or partnership notes can go to{" "}
          <Link href={`mailto:${socials.email}`} className="link">
            {socials.email}
          </Link>{" "}
          or the{" "}
          <Link href="/contact" className="link">
            contact page
          </Link>
          .
        </p>
      </article>
      <Footer />
    </Navbar>
  );
}
