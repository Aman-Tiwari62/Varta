export const fetchWithAuth = async ({
  url,
  options = {},
  accessToken,
  setAccessToken,
  setUser,
  logout,
}) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // 1️⃣ Attach access token
  const response = await fetch(`${BACKEND_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      Authorization: accessToken
        ? `Bearer ${accessToken}`
        : undefined,
    },
  });

  // 2️⃣ If token is valid → return response
  if (response.status !== 401) {
    return response;
  }

  // 3️⃣ If token expired → try refresh
  try {
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) throw new Error("Refresh failed");

    const data = await refreshRes.json();

    // 4️⃣ Update context with new token & user
    setAccessToken(data.accessToken);
    setUser(data.user);

    // 5️⃣ Retry original request with new token
    return fetch(`${BACKEND_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${data.accessToken}`,
      },
    });
  } catch (error) {
    // 6️⃣ Refresh failed → logout
    await logout();
    throw error;
  }
};
