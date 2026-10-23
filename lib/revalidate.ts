import { revalidatePath } from "next/cache";

interface RevalidateToolOptions {
  slug?: string;
  categories?: readonly string[] | string[];
}

export function revalidateToolPages({
  slug,
  categories,
}: RevalidateToolOptions = {}): void {
  try {
    revalidatePath("/");
    revalidatePath("/browse");

    if (slug) {
      revalidatePath(`/tool/${slug}`);
      revalidatePath(`/tool/${slug}/alternatives`);
    }

    if (categories && categories.length > 0) {
      for (const category of categories) {
        revalidatePath(`/${category}`);
      }
    }
  } catch (error) {
    console.error("Failed to revalidate tool paths:", error);
  }
}
