import api from "../axios";

export type Role = "SUPER_ADMIN" | "ADMIN" | "WAITER" | "KDS";
export type Status = "ACTIVE" | "DISABLED";

export type Account = {
  _id: string;
  username: string;
  role: Role;
  status?: Status;
  createdAt?: string;
  updatedAt?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export async function listAccounts(params: {
  role: Role;
  q?: string;
  status?: Status;
  page?: number;
  limit?: number;
}): Promise<Paginated<Account>> {
  const res = await api.get('/api/admin/accounts', { params });
  return res.data as Paginated<Account>;
}

export async function createAccount(body: {
  username: string;
  password: string;
  role: Role;
}): Promise<Account> {
  const res = await api.post('/api/admin/accounts', body);
  return res.data as Account;
}

export async function updateAccount(
  id: string,
  body: Partial<{
    username: string;
    password: string;
    role: Role;
    status: Status;
  }>
): Promise<Account> {
  const res = await api.patch(`/api/admin/accounts/${id}`, body);
  return res.data as Account;
}

export async function disableAccount(id: string): Promise<{ ok: boolean } | any> {
  const res = await api.patch(`api/admin/accounts/disable/${id}`);
  return res.data;
}

export async function enableAccount(id: string): Promise<{ ok: boolean } | any> {
  const res = await api.patch(`api/admin/accounts/enable/${id}`);
  return res.data;
}