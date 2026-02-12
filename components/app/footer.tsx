/** biome-ignore-all lint/performance/noImgElement: badges */
"use client";

import Link from "next/link";
import { ThemeDropdown } from "@/components/app/theme-dropdown";
import { categories, categoryLabels } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t mt-12 pt-12 md:pt-16 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-4">
          <Link href="/" className="text-2xl font-bold">
            ApexTools
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            The best AI tools directory for productivity, marketing, coding, and
            more.
          </p>
          <div className="mt-6">
            <ThemeDropdown />
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-4">Pages</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/browse"
                className="hover:text-foreground transition-colors"
              >
                Browse
              </Link>
            </li>
            <li>
              <Link
                href="/bookmarks"
                className="hover:text-foreground transition-colors"
              >
                Bookmarks
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 lg:col-span-4">
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 text-sm text-muted-foreground">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/${category}`}
                  className="hover:text-foreground transition-colors"
                >
                  {categoryLabels[category]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-4 py-6 border-t">
        <a
          href="https://www.proofstories.io/directory/products/apextools/"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://www.proofstories.io/directory/badges/l/apextools.svg"
            alt="ApexTools badge"
            width="200"
          />
        </a>
        <a
          href="https://foundrlist.com/product/apextools"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://foundrlist.com/api/badge/apextools"
            alt="Live on FoundrList"
            width="140"
          />
        </a>
        <a
          href="https://fazier.com/launches/www.apextools.site"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=neutral"
            width="140"
            alt="Fazier badge"
          />
        </a>
        <a
          href="https://tinylaunchpad.com/projects/apextools"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://tinylaunchpad.com/images/badges/tinylaunchpad-badge-light.svg"
            alt="Featured on TinyLaunchpad"
            width="200"
          />
        </a>
        <a href="https://tinylaunch.com" target="_blank" rel="noopener">
          <img
            src="https://tinylaunch.com/tinylaunch_badge_launching_soon.svg"
            alt="TinyLaunch Badge"
            width="200"
          />
        </a>
        <a
          href="https://buildvoyage.com/products/apextools?ref=badge"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://buildvoyage.com/images/featured_badge.png"
            alt="Featured on BuildVoyage"
            width="200"
          />
        </a>
        <a
          href="https://launchigniter.com/product/apextools?ref=badge-apextools"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://launchigniter.com/api/badge/apextools?theme=neutral"
            alt="Featured on LaunchIgniter"
            width="200"
            height="54"
          />
        </a>
        <a
          href="https://trylaunch.ai/launch/apextools"
          target="_blank"
          rel="noopener dofollow"
        >
          <img
            src="https://trylaunch.ai/badges/badge-color.svg"
            alt="Launch"
            width="200"
            height="54"
          />
        </a>
        <a href="https://twelve.tools" target="_blank" rel="noopener">
          <img
            src="https://twelve.tools/badge0-light.svg"
            alt="Featured on Twelve Tools"
            width="200"
            height="54"
          />
        </a>
        <a href="https://wired.business" target="_blank" rel="noopener">
          <img
            src="https://wired.business/badge0-light.svg"
            alt="Featured on Wired Business"
            width="200"
            height="54"
          />
        </a>
        <a
          href="https://frogdr.com/apextools.site?utm_source=apextools.site"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://frogdr.com/apextools.site/badge-white.svg"
            alt="Monitor your Domain Rating with FrogDR"
            width="250"
            height="54"
          />
        </a>
      </div>
      <div className="pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ApexTools. All rights reserved.
      </div>
    </footer>
  );
}
