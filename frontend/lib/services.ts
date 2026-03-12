import { API_URL } from "./api-config";

const getHeaders = () => {
  const token = localStorage.getItem("shms_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const documentService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/documents`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  },
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("shms_token");
    const res = await fetch(`${API_URL}/documents`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload document");
    return res.json();
  },
};

export const requestService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/requests`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch requests");
    return res.json();
  },
  create: async (requestData: any) => {
    const res = await fetch(`${API_URL}/requests`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(requestData),
    });
    if (!res.ok) throw new Error("Failed to create request");
    return res.json();
  },
  updateStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/requests/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  },
};

export const activityService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/activity`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch activity logs");
    return res.json();
  },
};

export const userService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },
};
