import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export function useAdminAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // wait
    if (!session || session.user.role !== "admin") {
      signIn();
    }
  }, [session, status]);

  return { session, status };
}
