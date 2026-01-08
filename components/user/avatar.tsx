import Image from "next/image";
import { useMemo } from "react";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: User | null;
  size?: number;
  className?: string;
}

export function UserAvatar({ user, size = 24, className }: UserAvatarProps) {
  const background = useMemo(() => {
    const str = user?.id ?? "User";

    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }

    const hue = sum % 360;
    const start = `hsl(${hue}, 60%, 40%)`;
    const end = `hsl(${hue + 30}, 60%, 40%)`;

    return `linear-gradient(to bottom right, ${start}, ${end})`;
  }, [user]);

  if (!user?.image) {
    return (
      <div
        className={cn("rounded-full grid place-items-center", className)}
        style={{
          background,
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          fontSize: size / 2,
        }}
      >
        <span className="text-white font-medium">
          {user?.name[0].toUpperCase() ?? "?"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={user?.image ?? ""}
      alt={user?.name ?? "User Avatar"}
      width={size}
      height={size}
      className={cn("rounded-full bg-secondary", className)}
      loading="lazy"
    />
  );
}
