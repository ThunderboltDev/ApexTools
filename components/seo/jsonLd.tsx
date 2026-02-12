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
import type { Category, Tool } from "@/lib/types";

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
    name: "Thunderbolt",
    url: url,
    image: `${url}/logo.webp`,
    jobTitle: "Web Developer",
    description:
      "Self taught web developer building beautiful websites one line of code at a time.",
    sameAs: [socials.twitter, socials.discord, socials.github],
  };
}

export function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "⚡ Thunderbolt",
    url: url,
    description:
      "I am a self taught web developer building beautiful websites one line of code at a time.",
    publisher: {
      "@type": "Person",
      name: "Thunderbolt",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/browse?search={query}`,
      query: "query",
    },
  };
}

export function getToolCollectionJsonLd(
  category: string,
  tools: Tool[],
  headline: string,
  description: string
): WithContext<CollectionPage> {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} | ApexTools`,
    description: `${headline} ${description}`,
    url: `${url}/${category}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryName,
          item: `${url}/${category}`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${url}/tool/${tool.slug}`,
        name: tool.name,
      })),
    },
  };
}

export function getSearchResultsJsonLd(
  tools: Tool[]
): WithContext<SearchResultsPage> {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: "Search Results | ApexTools",
    url: `${url}/browse`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Browse",
          item: `${url}/browse`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${url}/tool/${tool.slug}`,
        name: tool.name,
      })),
    },
  };
}

const mapping: Record<Category, string> = {
  llm: "AIApplication",
  image: "MultimediaApplication",
  code: "DeveloperApplication",
  video: "MultimediaApplication",
  audio: "MultimediaApplication",
  music: "MultimediaApplication",
  writing: "TextEditor",
  research: "ReferenceApplication",
  design: "DesignApplication",
  data: "DataVisualizationApplication",
  seo: "BusinessApplication",
  education: "EducationApplication",
  copywriting: "BusinessApplication",
  translation: "ReferenceApplication",
  gaming: "GameApplication",
  legal: "BusinessApplication",
  finance: "FinanceApplication",
  productivity: "BusinessApplication",
  marketing: "BusinessApplication",
};

function mapCategoryToSchemaOrg(category: Category): string {
  return mapping[category] || "SoftwareApplication";
}

export function getToolJsonLd(
  tool: Tool,
  authorName: string = "Unknown Author"
): WithContext<SoftwareApplication> {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.tagline,
    image: tool.logo,
    applicationCategory: mapCategoryToSchemaOrg(tool.category[0]),
    operatingSystem: tool.platform
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(", "),
    url: `${url}/tool/${tool.slug}`,
    author: {
      "@type": "Person",
      name: authorName,
    },
    datePublished: tool.createdAt.toISOString(),
    dateModified: tool.updatedAt.toISOString(),
    ...(tool.upvotes > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: { "@type": "LikeAction" },
        userInteractionCount: tool.upvotes,
      },
    }),
    ...(tool.pricing && {
      offers: {
        "@type": "Offer",
        price: tool.pricing === "free" ? "0" : undefined,
        priceCurrency: "USD",
        description: tool.pricing,
      },
    }),
    ...(tool.verifiedAt && {
      publisher: {
        "@type": "Organization",
        name: "ApexTools",
        description: "Verified Domain",
      },
    }),
  } satisfies WithContext<SoftwareApplication>;

  return jsonLd;
}

export function getFAQJsonLd(
  faqs: Array<{ question: string; answer: string }>
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getWebPageJsonLd(
  name: string,
  description: string,
  path: string = ""
): WithContext<WebPage> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${name} | ApexTools`,
    description: description,
    url: `${url}${path}`,
    publisher: {
      "@type": "Organization",
      name: "ApexTools",
    },
  };
}

export function getOrganizationJsonLd(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ApexTools",
    url: url,
    logo: `${url}/logo.webp`,
    description:
      "The curated directory for power users. Find the tools that are shaping the future, updated in real-time.",
    sameAs: [socials.twitter, socials.discord, socials.github],
  };
}

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getBreadcrumbJsonLd(
  breadcrumbs: BreadcrumbItem[]
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}
