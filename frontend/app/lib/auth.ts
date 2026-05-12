export interface User {
  username: string;
  role: "admin" | "sme";
  company_name: string;
  email: string;
}

export const authStorage = {
  getToken: () => typeof window !== "undefined" ? localStorage.getItem("supplyshield_token") : null,
  setToken: (token: string) => localStorage.setItem("supplyshield_token", token),
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const u = localStorage.getItem("supplyshield_user");
    return u ? JSON.parse(u) : null;
  },
  setUser: (user: User) => localStorage.setItem("supplyshield_user", JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem("supplyshield_token");
    localStorage.removeItem("supplyshield_user");
  },
};

export async function loginApi(username: string, password: string) {
  const res = await fetch("http://localhost:8000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Kullanıcı adı veya şifre hatalı");
  return res.json();
}

export async function registerApi(data: {
  username: string;
  password: string;
  company_name: string;
  email: string;
}) {
  const res = await fetch("http://localhost:8000/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Kayıt başarısız");
  }
  return res.json();
}

export async function fetchUsersApi(token: string) {
  const res = await fetch("http://localhost:8000/api/v1/auth/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erişim reddedildi");
  return res.json();
}

export async function deleteUserApi(username: string, token: string) {
  const res = await fetch(`http://localhost:8000/api/v1/auth/users/${username}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Silme başarısız");
  return res.json();
}
