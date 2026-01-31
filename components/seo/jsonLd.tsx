import type {
  Article,
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  ItemList,
  Organization,
  Person,
  SearchResultsPage,
  SoftwareApplication,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";
import { socials, url } from "@/config";
import type { Tool } from "@/lib/types";

type JsonLdTypes =
  | Article
  | BreadcrumbList
  | Organization
  | Person
  | WebSite
  | WebPage
  | ItemList
  | FAQPage
  | CollectionPage
  | SearchResultsPage
  | SoftwareApplication;

export function JsonLd<T extends JsonLdTypes>({
  data,
}: {
  data: WithContext<T>;
}) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Structured Data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getPersonJsonLd(): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Thunderbolt",
    "url": url,
    "image": `${url}/logo.webp`,
    "jobTitle": "Web Developer",
    "description":
      "Self taught web developer building beautiful websites one line of code at a time.",
    "sameAs": [socials.twitter, socials.discord, socials.github],
  };
}

export function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "⚡ Thunderbolt",
    "url": url,
    "description":
      "I am a self taught web developer building beautiful websites one line of code at a time.",
    "publisher": {
      "@type": "Person",
      "name": "Thunderbolt",
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${url}/browse?search={query}`,
      "query": "query",
    },
  };
}

export function getToolCollectionJsonLd(
  category: string,
  tools: Tool[],
  headline: string,
  description: string,
): WithContext<CollectionPage> {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} | ApexTools`,
    "description": `${headline} ${description}`,
    "url": `${url}/${category}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": url,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": categoryName,
          "item": `${url}/${category}`,
        },
      ],
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${url}/tool/${tool.slug}`,
        "name": tool.name,
      })),
    },
  };
}

export function getSearchResultsJsonLd(
  tools: Tool[],
): WithContext<SearchResultsPage> {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": "Search Results | ApexTools",
    "url": `${url}/browse`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": url,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Browse",
          "item": `${url}/browse`,
        },
      ],
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${url}/tool/${tool.slug}`,
        "name": tool.name,
      })),
    },
  };
}

function mapCategoryToSchemaOrg(category: string): string {
  const mapping: Record<string, string> = {
    "developer-tools": "DeveloperApplication",
    "design": "DesignApplication",
    "productivity": "BusinessApplication",
    "communication": "CommunicationApplication",
    "security": "SecurityApplication",
  };

  return mapping[category] || "SoftwareApplication";
}

export function getToolJsonLd(tool: Tool): WithContext<SoftwareApplication> {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.tagline,
    "image": tool.logo,
    "applicationCategory": mapCategoryToSchemaOrg(tool.category[0]),
    "operatingSystem": tool.platform
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(", "),
    "url": `${url}/tool/${tool.slug}`,
    "author": {
      "@type": "Organization",
      "name": "ApexTools",
    },
    "datePublished": tool.createdAt.toISOString(),
    "dateModified": tool.updatedAt.toISOString(),
    ...(tool.upvotes > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        "ratingValue": 5,
        "ratingCount": tool.upvotes,
        "bestRating": 5,
        "worstRating": 1,
      },
      interactionStatistic: {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "LikeAction" },
        "userInteractionCount": tool.upvotes,
      },
    }),
    ...(tool.verifiedAt && {
      publisher: {
        "@type": "Organization",
        "name": "ApexTools",
        "description": "Verified Domain",
      },
    }),
  } satisfies WithContext<SoftwareApplication>;

  return jsonLd;
}

export function getFAQJsonLd(
  faqs: Array<{ question: string; answer: string }>,
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function getOrganizationJsonLd(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ApexTools",
    "url": url,
    "logo": `${url}/logo.webp`,
    "description":
      "The curated directory for power users. Find the tools that are shaping the future, updated in real-time.",
    "sameAs": [socials.twitter, socials.discord, socials.github],
  };
}

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getBreadcrumbJsonLd(
  breadcrumbs: BreadcrumbItem[],
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item,
    })),
  };
}
