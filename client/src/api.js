const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Please check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // the response had no JSON body
  }

  if (!response.ok) {
    throw new Error((data && data.message) || "Something went wrong. Please try again.");
  }

  return data;
}