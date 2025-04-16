export const loginUser = async (username) => {
    const response = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) throw new Error("Login failed");
  
    const data = await response.json();
    return data.token;
  };
  
  export const ingestData = async (token, endpoint) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  
    if (!response.ok) throw new Error("Ingestion failed");
  
    return await response.json();
  };
  