"use client";

import { createContext, type PropsWithChildren, useContext } from "react";
import type { User } from "@/lib/types";
import { trpc } from "@/trpc/provider";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
  invalidate: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.user.getSession.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const refetch = async () => {
    await utils.user.getSession.refetch();
  };

  const invalidate = async () => {
    await utils.user.getSession.invalidate();
  };

  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? null,
        isLoading,
        refetch,
        invalidate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
