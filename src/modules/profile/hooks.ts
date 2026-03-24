import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "./api";
import { toast } from "sonner";
import { useAuthStore } from "../auth/store";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (file: File) => profileApi.updateAvatar(file),
    onSuccess: (data) => {
      toast.success("Foto de perfil actualizada correctamente");
      updateUser({ avatarUrl: data.url });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    onError: () => {
      toast.error("No se pudo actualizar la foto de perfil");
    },
  });
}
