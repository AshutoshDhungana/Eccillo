import { api, apiFetch, tokenStore } from "./client";
import type { Membership, Organization, TokenResponse, User } from "../types";

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_name: string;
  organization_type: Organization["type"];
}

export const authApi = {
  register: (input: RegisterInput) => api.post<TokenResponse>("/auth/register", input, { auth: false, idempotency: false }),
  login: (email: string, password: string) =>
    // The running FastAPI deployment uses OAuth-style form fields. Django's
    // documented endpoint also accepts these exact `username`/`password` values.
    apiFetch<TokenResponse>("/auth/login", {
      method: "POST",
      auth: false,
      idempotency: false,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      rawBody: new URLSearchParams({ username: email.trim(), password }).toString(),
    }),
  logout: async () => {
    try { await api.post("/auth/logout", {}); } finally { tokenStore.clear(); }
  },
  me: () => api.get<User>("/me"),
  refresh: (refreshToken: string) => api.post<TokenResponse>("/auth/refresh", { refresh_token: refreshToken }, { auth: false, idempotency: false }),
  switchOrganization: (membershipId: string) => api.post<TokenResponse>("/auth/switch-organization", { membership_id: membershipId }),
  createOrganization: (input: Partial<Organization>) => api.post<Organization>("/organizations", input),
  members: (organizationId: string) => api.get<Membership[]>("/organizations/" + organizationId + "/members"),
  grantCapability: (organizationId: string, body: Record<string, string>) =>
    api.post<{ id: string }>("/organizations/" + organizationId + "/members", body),
};
