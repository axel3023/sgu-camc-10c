const UserController = {};
const ENV = import.meta.env;
const API_URL = `http://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}/users`;

UserController.getUsers = async () => {
  const res = await fetch(API_URL);
  const result = await res.json();
  return result.data || [];
};

UserController.createUser = async (user) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user), // 👈 directamente el objeto user
  });
  const result = await res.json();
  return result.data || result; // depende del formato del backend
};

UserController.updateUser = async (id, user) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const result = await res.json();
  return result.data || result;
};

UserController.deleteUser = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

export default UserController;
