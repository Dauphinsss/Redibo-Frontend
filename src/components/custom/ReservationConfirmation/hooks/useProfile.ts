// hooks/useUserProfile.ts
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export type UserProfile = {
  id: number;
  nombre: string;
  correo: string;
  ciudad: { nombre: string };
  telefono: string;
};

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    api
      .get("/profile", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setProfile(res.data))
      .catch(() => router.push("/login"));
  }, [user]);

  return profile;
}
