import React, { useEffect, useState } from 'react';
import UserController from './modules/controller/userController';

// --- ICONOS ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

function App() {
  const [users, setUsers] = useState([]);
  
  const [createFormData, setCreateFormData] = useState({ name: '', correo: '', tel: '' });
  
  const [editFormData, setEditFormData] = useState({ name: '', correo: '', tel: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await UserController.getUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsers([]);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await UserController.createUser(createFormData);
    setCreateFormData({ name: '', correo: '', tel: '' }); // Limpiar form de crear
    loadUsers();
  };

  const handleEditClick = (user) => {
    setEditFormData({
      name: user.name,
      correo: user.correo,
      tel: user.tel,
    });
    setEditingUserId(user.id);
    setIsModalOpen(true); 
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (editingUserId) {
      await UserController.updateUser(editingUserId, editFormData);
      setIsModalOpen(false); 
      setEditingUserId(null);
      loadUsers();
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      await UserController.deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        <div style={styles.formCard}>
          <h2 style={styles.title}>Nuevo Usuario</h2>
          <form onSubmit={handleCreateSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre completo</label>
              <input
                type="text"
                name="name"
                value={createFormData.name}
                onChange={handleCreateChange}
                required
                style={styles.input}
                placeholder="Ej. Ana Garcia"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={createFormData.correo}
                onChange={handleCreateChange}
                required
                style={styles.input}
                placeholder="ana@email.com"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Teléfono</label>
              <input
                type="text"
                name="tel"
                value={createFormData.tel}
                onChange={handleCreateChange}
                required
                style={styles.input}
                placeholder="555-000-1234"
              />
            </div>
            <button type="submit" style={styles.saveButton}>
              Registrar Usuario
            </button>
          </form>
        </div>

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
                          onClick={() => handleEditClick(u)} 
                          style={styles.iconButton} 
                          title="Editar en Modal"
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
                    <td colSpan="5" style={styles.emptyState}>No hay usuarios registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0}}>Editar Usuario</h2>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeButton}>
                <CloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={editFormData.correo}
                  onChange={handleEditChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Teléfono</label>
                <input
                  type="text"
                  name="tel"
                  value={editFormData.tel}
                  onChange={handleEditChange}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" style={styles.saveButton}>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
 
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
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
    flexWrap: 'wrap',
  },
  formCard: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    height: 'fit-content',
  },
  tableCard: {
    flex: 2,
    minWidth: '400px',
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginTop: 0,
    marginBottom: '1.5rem',
    color: '#1f2937',
    fontSize: '1.5rem',
    borderBottom: '2px solid #f3f4f6',
    paddingBottom: '10px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
  },
  saveButton: {
    padding: '10px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1,
  },
  
  tableResponsive: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e5e7eb', color: '#4b5563' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px', color: '#374151' },
  emptyState: { padding: '2rem', textAlign: 'center', color: '#9ca3af' },
  actionButtonsContainer: { display: 'flex', justifyContent: 'center', gap: '8px' },
  iconButton: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px' },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(2px)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'fadeIn 0.2s ease-out'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '10px'
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center'
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};

export default App;