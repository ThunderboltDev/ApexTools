import { Suspense } from "react";
import { Footer } from "@/components/app/footer";
import { Navbar } from "@/components/app/navbar";
import { ToolDirectory } from "@/components/directory";
import { LoadingScreen } from "@/components/ui/loading-screen";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <Navbar>
      <div className="mt-4 mb-8 space-y-3">
        <h1 className="md:text-6xl text-balance text-center bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
          Discover the <span className="text-primary">Apex</span> of AI
        </h1>
        <p className="text-center md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The curated directory for power users. Find the tools that are shaping
          the future, updated in real-time.
        </p>
      </div>
      <Suspense fallback={<LoadingScreen />}>
        <ToolDirectory />
      </Suspense>
      <Footer />
    </Navbar>
  );
}
