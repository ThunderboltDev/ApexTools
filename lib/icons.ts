import {
  Analytics01Icon,
  AnalyticsUpIcon,
  AndroidIcon,
  ApiIcon,
  AppleIcon,
  ArrowUpBigIcon,
  BookOpen01Icon,
  BrainIcon,
  BrowserIcon,
  Cancel01Icon,
  CheckListIcon,
  Clock02Icon,
  CodeSimpleIcon,
  CreditCardIcon,
  Database01Icon,
  Edit02Icon,
  EyeIcon,
  Fire03Icon,
  GameController01Icon,
  GiftIcon,
  GlobeIcon,
  GridViewIcon,
  Image02Icon,
  JusticeScale01Icon,
  LanguageCircleIcon,
  Layers01Icon,
  LinkSquare02Icon,
  Megaphone01Icon,
  MusicNote01Icon,
  PaintBrush02Icon,
  PenTool01Icon,
  Radar01Icon,
  Search02Icon,
  Tick02Icon,
  Video01Icon,
  VolumeHighIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type {
  AnalyticsEventFilter,
  CategoryFilter,
  PlatformFilter,
  PricingModelFilter,
  SortOptionFilter,
  StatusFilter,
} from "@/lib/types";

export const categoryIcons: Record<CategoryFilter, IconSvgElement> = {
  all: GridViewIcon,
  productivity: CheckListIcon,
  marketing: Megaphone01Icon,
  llm: BrainIcon,
  image: Image02Icon,
  code: CodeSimpleIcon,
  video: Video01Icon,
  audio: VolumeHighIcon,
  music: MusicNote01Icon,
  writing: PenTool01Icon,
  research: Search02Icon,
  design: PaintBrush02Icon,
  data: Database01Icon,
  seo: Analytics01Icon,
  education: BookOpen01Icon,
  copywriting: Edit02Icon,
  translation: LanguageCircleIcon,
  gaming: GameController01Icon,
  legal: JusticeScale01Icon,
  finance: Wallet01Icon,
};

export const platformIcons: Record<PlatformFilter, IconSvgElement> = {
  all: GridViewIcon,
  web: GlobeIcon,
  android: AndroidIcon,
  ios: AppleIcon,
  chrome_extension: BrowserIcon,
  api: ApiIcon,
} as const;

export const pricingModelIcons: Record<PricingModelFilter, IconSvgElement> = {
  all: GridViewIcon,
  free: GiftIcon,
  freemium: Layers01Icon,
  paid: CreditCardIcon,
};

export const statusIcons: Record<StatusFilter, IconSvgElement> = {
  all: GridViewIcon,
  pending: Clock02Icon,
  approved: Tick02Icon,
  rejected: Cancel01Icon,
};

export const analyticsEventIcons: Record<AnalyticsEventFilter, IconSvgElement> =
  {
    all: GridViewIcon,
    view: EyeIcon,
    visit: LinkSquare02Icon,
    impression: Radar01Icon,
  };

export const sortOptionsIcons: Record<SortOptionFilter, IconSvgElement> = {
  all: GridViewIcon,
  latest: Clock02Icon,
  hot: Fire03Icon,
  trending: AnalyticsUpIcon,
  upvotes: ArrowUpBigIcon,
  views: EyeIcon,
};
