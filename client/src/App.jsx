import React, { useEffect, useState } from 'react';
import UserController from './modules/controller/userController';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ fullname: '', email: '', phoneNumber: '' });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

const loadUsers = async () => {
  try {
    const response = await UserController.getUsers();
    setUsers(Array.isArray(response) ? response : []);
    console.log("Usuarios cargados:", response);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    setUsers([]);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUserId) {
      await UserController.updateUser(editingUserId, formData);
    } else {
      await UserController.createUser(formData);
    }
    setFormData({ fullname: '', email: '', phoneNumber: '' });
    setEditingUserId(null);
    loadUsers();
  };

  const handleEdit = (user) => {
    setFormData({
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      await UserController.deleteUser(id);
      loadUsers();
    }
  };

  const handleCancel = () => {
    setFormData({ fullname: '', email: '', phoneNumber: '' });
    setEditingUserId(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>{editingUserId ? 'Editar Usuario' : 'Crear Usuario'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="fullname"
            placeholder="Nombre completo"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Teléfono"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <div style={styles.buttons}>
            <button type="submit">{editingUserId ? 'Actualizar' : 'Guardar'}</button>
            {editingUserId && (
              <button type="button" onClick={handleCancel} style={{ background: '#ccc' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.tableContainer}>
        <h2>Lista de Usuarios</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre completo</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.fullname}</td>
                <td>{u.email}</td>
                <td>{u.phoneNumber}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Editar</button>
                  <button onClick={() => handleDelete(u.id)} style={{ background: 'red', color: 'white' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    padding: '2rem',
    gap: '2rem',
    fontFamily: 'sans-serif',
  },
  formContainer: {
    flex: 1,
    borderRight: '1px solid #ddd',
    paddingRight: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
  },
  tableContainer: {
    flex: 2,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #ccc',
    textAlign: 'left',
    padding: '8px',
  },
  td: {
    borderBottom: '1px solid #eee',
    padding: '8px',
  },
};

export default App;
