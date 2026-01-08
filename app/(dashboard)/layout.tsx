"use client";

import {
  AnalyticsIcon,
  DashboardSquareEditIcon,
  Home01Icon,
  LogoutSquare01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import { SubmitToolButton } from "@/components/tool/submit";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { PageWrapper } from "@/components/ui/page";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  {
    title: "Overview",
    url: "/overview",
    icon: Home01Icon,
  },
  {
    title: "Tools",
    url: "/tools",
    icon: DashboardSquareEditIcon,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: AnalyticsIcon,
  },
];

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const { user, isLoading } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/auth?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}

function DashboardLayoutContent({ children }: Readonly<PropsWithChildren>) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center transition-all duration-300">
            <Image
              src="/logo.webp"
              alt="ApexAura Logo"
              width={500}
              height={500}
              className="size-8"
            />
            <span className="font-bold text-xl text-foreground group-data-[collapsible=icon]:hidden transition-all duration-300">
              ApexAura
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        href={item.url}
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <HugeiconsIcon icon={item.icon} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                variant="transparent"
                theme="danger"
                href="/logout"
              >
                <HugeiconsIcon icon={LogoutSquare01Icon} />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/profile"
                tooltip="Profile"
                className="group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:rounded-full"
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    className="size-6 rounded-full"
                    width={20}
                    height={20}
                  />
                ) : (
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center">
                    <HugeiconsIcon icon={UserIcon} className="size-4" />
                  </div>
                )}
                <span className="truncate">{user?.name ?? "User"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex sticky z-25 top-0 h-14 shrink-0 items-center justify-between gap-2 bg-background/50 backdrop-blur-md border-b px-3">
          <SidebarTrigger />
          <SubmitToolButton />
        </header>
        <PageWrapper>{children}</PageWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}
