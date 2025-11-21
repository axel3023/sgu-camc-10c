import React, { useEffect, useState } from 'react';
import UserController from './modules/controller/userController';

// Iconos SVG simples para no depender de librerías externas
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', correo: '', tel: '' });
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
    setFormData({ name: '', correo: '', tel: '' });
    setEditingUserId(null);
    loadUsers();
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      correo: user.correo,
      tel: user.tel,
    });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      await UserController.deleteUser(id);
      loadUsers();
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', correo: '', tel: '' });
    setEditingUserId(null);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        {/* Sección del Formulario */}
        <div style={styles.formCard}>
          <h2 style={styles.title}>{editingUserId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre completo</label>
              <input
                type="text"
                name="name"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                placeholder="ejemplo@correo.com"
                value={formData.correo}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Teléfono</label>
              <input
                type="text"
                name="tel"
                placeholder="555-555-5555"
                value={formData.tel}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.buttons}>
              <button type="submit" style={styles.saveButton}>
                {editingUserId ? 'Actualizar Datos' : 'Guardar Usuario'}
              </button>
              {editingUserId && (
                <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Sección de la Tabla */}
        <div style={styles.tableCard}>
          <h2 style={styles.title}>Directorio de Usuarios</h2>
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Teléfono</th>
                  <th style={{...styles.th, textAlign: 'center'}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>{u.id}</td>
                    <td style={styles.td}><b>{u.name}</b></td>
                    <td style={styles.td}>{u.correo}</td>
                    <td style={styles.td}>{u.tel}</td>
                    <td style={{...styles.td, textAlign: 'center'}}>
                      <div style={styles.actionButtonsContainer}>
                        <button 
                          onClick={() => handleEdit(u)} 
                          style={styles.iconButton} 
                          title="Editar"
                        >
                          <EditIcon />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)} 
                          style={styles.iconButton} 
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={styles.emptyState}>
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // Un gris muy claro para que el blanco resalte
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    display: 'flex',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
    flexWrap: 'wrap', // Para que sea responsivo
  },
  // Estilos de las "Tarjetas" (Fondo blanco)
  formCard: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    height: 'fit-content',
  },
  tableCard: {
    flex: 2,
    minWidth: '400px',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  title: {
    marginTop: 0,
    marginBottom: '1.5rem',
    color: '#1f2937',
    fontSize: '1.5rem',
    borderBottom: '2px solid #f3f4f6',
    paddingBottom: '10px',
  },
  // Estilos del Formulario
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  buttons: { display: 'flex', gap: '1rem', marginTop: '10px' },
  saveButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  // Estilos de la Tabla
  tableResponsive: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #e5e7eb',
    color: '#4b5563',
    fontWeight: '600',
  },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px', color: '#374151' },
  emptyState: { padding: '2rem', textAlign: 'center', color: '#9ca3af' },
  
  // Estilos de Acciones (Iconos)
  actionButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
};

export default App;