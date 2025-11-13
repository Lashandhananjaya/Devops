const API_BASE_URL = "http://localhost:5000/api";

export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    // Store user data in localStorage
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ========== ROOMS API ==========
export const getAllRooms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch rooms");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableRooms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/available`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch available rooms");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch room");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getRoomsByType = async (type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/type/${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch rooms by type");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const createRoom = async (roomData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create room");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== OFFERS API ==========
export const getAllOffers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/offers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch offers");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getActiveOffers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/offers/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch active offers");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOfferByCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/offers/code/${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Invalid or expired offer code");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const createOffer = async (offerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offerData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create offer");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
