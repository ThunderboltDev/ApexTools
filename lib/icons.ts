import {
  AnalyticsUpIcon,
  ArrowUpBigIcon,
  BrainIcon,
  Cancel01Icon,
  CheckListIcon,
  Clock02Icon,
  CodeSimpleIcon,
  CreditCardIcon,
  EyeIcon,
  Fire03Icon,
  GiftIcon,
  GridViewIcon,
  Image02Icon,
  Layers01Icon,
  LinkSquare02Icon,
  Megaphone01Icon,
  MusicNote01Icon,
  PenTool01Icon,
  Radar01Icon,
  Search02Icon,
  Tick02Icon,
  Video01Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type {
  AnalyticsEventFilter,
  CategoryFilter,
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
};

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
    upvote: ArrowUpBigIcon,
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
