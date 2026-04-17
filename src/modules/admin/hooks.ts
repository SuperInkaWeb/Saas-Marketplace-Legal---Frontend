import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./api";
import { UpdateAccountStatusRequest, VerifyLawyerRequest } from "./types";

// ── Query Keys ────────────────────────────────────────────────────────
const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  users: (filters: Record<string, unknown>) =>
    [...adminKeys.all, "users", filters] as const,
  userDetail: (id: string) => [...adminKeys.all, "users", id] as const,
  pendingLawyers: () => [...adminKeys.all, "pending-lawyers"] as const,
};

// ── Dashboard ─────────────────────────────────────────────────────────
export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.getDashboard(),
    staleTime: 30_000,
  });
}

// ── Users ─────────────────────────────────────────────────────────────
export function useAdminUsers(params: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminApi.getUsers(params),
    staleTime: 15_000,
  });
}

export function useAdminUserDetail(publicId: string) {
  return useQuery({
    queryKey: adminKeys.userDetail(publicId),
    queryFn: () => adminApi.getUserDetail(publicId),
    enabled: !!publicId,
  });
}

export function useUpdateAccountStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      body,
    }: {
      publicId: string;
      body: UpdateAccountStatusRequest;
    }) => adminApi.updateAccountStatus(publicId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (publicId: string) => adminApi.deleteUser(publicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

// ── Lawyer Verification ───────────────────────────────────────────────
export function useAdminPendingLawyers() {
  return useQuery({
    queryKey: adminKeys.pendingLawyers(),
    queryFn: () => adminApi.getPendingLawyers(),
    staleTime: 15_000,
  });
}

export function useVerifyLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userPublicId,
      body,
    }: {
      userPublicId: string;
      body: VerifyLawyerRequest;
    }) => adminApi.verifyLawyer(userPublicId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}
