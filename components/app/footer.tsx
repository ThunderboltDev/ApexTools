"use client";

import Link from "next/link";
import { ThemeDropdown } from "@/components/app/theme-dropdown";
import { categories, categoryLabels } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t mt-12 pt-12 md:pt-16 px-4 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-xl font-bold">
            ApexTools
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            The best AI tools directory for productivity, marketing, coding, and
            more.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 5).map((category) => (
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

        <div>
          <h3 className="font-semibold mb-4">More Categories</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(5).map((category) => (
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

        <div>
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

          <div className="mt-8">
            <ThemeDropdown />
          </div>
        </div>
      </div>

      <div className="border-t pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ApexTools. All rights reserved.
      </div>
    </footer>
  );
}
