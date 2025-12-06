import React, { useEffect, useState } from 'react';
import UserController from './modules/controller/userController';

// --- ICONOS (Estilo minimalista) ---
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

  // --- CREAR ---
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
        await UserController.createUser(createFormData);
        setCreateFormData({ name: '', correo: '', tel: '' }); 
        loadUsers();
    } catch (error) {
        console.error("Error al crear:", error);
        alert("Ocurrió un error al guardar.");
    }
  };

  // --- EDITAR ---
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
      try {
        await UserController.updateUser(editingUserId, editFormData);
        setIsModalOpen(false);
        setEditingUserId(null);
        loadUsers();
      } catch (error) {
        console.error("Error al actualizar:", error);
      }
    }
  };

  // --- ELIMINAR ---
  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('¿Confirmar eliminación del registro?')) {
      await UserController.deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Navbar Simple */}
      <nav style={styles.navbar}>
        <span style={styles.brand}>Gerson Uribe Casarrubias<span style={{fontWeight:'300'}}></span></span>
        <div style={styles.navLinks}> Usuarios</div>
      </nav>

      <div style={styles.mainContent}>
        
        {/* SECCIÓN SUPERIOR: FORMULARIO */}
        <div style={styles.topSection}>
          <div style={styles.formContainer}>
            <h3 style={styles.sectionTitle}>Nuevo Registro</h3>
            <form onSubmit={handleCreateSubmit} style={styles.horizontalForm}>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="name"
                  value={createFormData.name}
                  onChange={handleCreateChange}
                  required
                  style={styles.input}
                  placeholder="Nombre (ej. Carlos Méndez)"
                />
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  name="correo" 
                  value={createFormData.correo}
                  onChange={handleCreateChange}
                  required
                  style={styles.input}
                  placeholder="carlos.m@gmail.com"
                />
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="tel"
                  value={createFormData.tel}
                  onChange={handleCreateChange}
                  required
                  style={styles.input}
                  placeholder="55-8899-0000"
                />
              </div>
              <button type="submit" style={styles.addButton}>
                Guardar
              </button>
            </form>
          </div>
        </div>

        <div style={styles.gridSection}>
            <h3 style={styles.sectionTitle}>Usuarios Activos ({users.length})</h3>
            
            <div style={styles.cardGrid}>
              {users.map((u) => (
                <div key={u.id} style={styles.userCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.avatarCircle}>{u.name.substring(0,2).toUpperCase()}</div>
                    <div style={styles.cardActions}>
                        <button onClick={() => handleEditClick(u)} style={styles.cardBtn}><EditIcon/></button>
                        <button onClick={() => handleDelete(u.id)} style={styles.cardBtn}><DeleteIcon/></button>
                    </div>
                  </div>
                  
                  <div style={styles.cardBody}>
                    <h4 style={styles.userName}>{u.name}</h4>
                    <p style={styles.userInfo}>ID: <span style={{opacity: 0.7}}>#{u.id}</span></p>
                    <div style={styles.divider}></div>
                    <p style={styles.contactRow}>📧 {u.correo}</p>
                    <p style={styles.contactRow}>📱 {u.tel}</p>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                 <div style={styles.emptyMsg}>No hay datos para mostrar.</div>
              )}
            </div>
        </div>

      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalPanel}>
            <div style={styles.modalHead}>
              <h4>Editar Información</h4>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}><CloseIcon/></button>
            </div>
            <form onSubmit={handleUpdateSubmit} style={styles.modalForm}>
              <label style={styles.label}>Nombre Completo</label>
              <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} style={styles.modalInput} required />
              
              <label style={styles.label}>Correo Electrónico</label>
              <input type="email" name="correo" value={editFormData.correo} onChange={handleEditChange} style={styles.modalInput} required />
              
              <label style={styles.label}>Teléfono</label>
              <input type="text" name="tel" value={editFormData.tel} onChange={handleEditChange} style={styles.modalInput} required />
              
              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>Cancelar</button>
                <button type="submit" style={styles.saveBtn}>Actualizar</button>
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
    backgroundColor: '#000000', // Fondo negro puro para contraste
    color: '#e5e5e5',
    fontFamily: "'Courier New', Courier, monospace", // Cambio de fuente para que se vea "técnico"
  },
  navbar: {
    borderBottom: '1px solid #333',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a0a0a'
  },
  brand: { fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px', color: '#fff' },
  navLinks: { fontSize: '0.8rem', color: '#666' },
  
  mainContent: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  // FORMULARIO SUPERIOR (Horizontal)
  topSection: { marginBottom: '40px' },
  formContainer: {
    backgroundColor: '#111',
    border: '1px solid #333',
    padding: '20px',
    borderRadius: '4px',
  },
  horizontalForm: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  inputWrapper: { flex: 1, minWidth: '200px' },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#000',
    border: '1px solid #444',
    color: '#fff',
    fontFamily: 'inherit',
    outline: 'none',
  },
  addButton: {
    padding: '12px 25px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    minWidth: '120px',
    transition: 'opacity 0.2s',
  },
  
  // GRID DE USUARIOS (NUEVO DISEÑO DEL GET)
  gridSection: { width: '100%' },
  sectionTitle: { 
    borderLeft: '4px solid #38bdf8', 
    paddingLeft: '10px', 
    marginBottom: '20px',
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    letterSpacing: '2px',
    color: '#888'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Rejilla adaptable
    gap: '20px',
  },
  userCard: {
    backgroundColor: '#111',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '20px',
    position: 'relative',
    transition: 'transform 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  avatarCircle: {
    width: '50px',
    height: '50px',
    backgroundColor: '#222',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: '1px solid #444'
  },
  cardActions: { display: 'flex', gap: '5px' },
  cardBtn: {
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardBody: { marginTop: '10px' },
  userName: { margin: '0 0 5px 0', fontSize: '1.1rem', color: '#fff' },
  userInfo: { margin: 0, fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' },
  divider: { height: '1px', backgroundColor: '#222', margin: '15px 0' },
  contactRow: { margin: '5px 0', fontSize: '0.85rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px' },
  
  emptyMsg: { gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#444', border: '2px dashed #222' },

  // MODAL ESTILO TÉCNICO
  modalBackdrop: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 999
  },
  modalPanel: {
    backgroundColor: '#000',
    border: '1px solid #444',
    width: '400px',
    padding: '30px',
    boxShadow: '0 0 20px rgba(255,255,255,0.05)'
  },
  modalHead: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' },
  modalInput: { padding: '10px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', outline: 'none' },
  modalFooter: { display: 'flex', gap: '10px', marginTop: '10px' },
  saveBtn: { flex: 1, padding: '10px', backgroundColor: '#38bdf8', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1px solid #444', color: '#888', cursor: 'pointer' }
};

export default App;