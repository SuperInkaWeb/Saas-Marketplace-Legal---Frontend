import api from "@/lib/api";

export const profileApi = {
  updateAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await api.patch<{ url: string }>("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
