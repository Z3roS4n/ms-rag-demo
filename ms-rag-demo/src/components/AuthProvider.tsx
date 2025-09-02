"use client";

import { useSession } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // This will initialize the auth client
  useSession();
  
  return <>{children}</>;
}
