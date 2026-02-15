const { useState, useEffect } = React;
// Import des modules Firebase définis dans l'importmap de index.html
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, getDocs } from "firebase/firestore";

// --- 1. CONFIGURATION FIREBASE ---
// ---------------------------------------------------------
// IMPORTANT : Remplacez les valeurs ci-dessous par celles de votre console Firebase
// (Project Settings -> General -> Your apps -> Config)
// ---------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyDXveZDB7z31kVANa7_3VwT4JKxuP4L6vg",          // REMPLACEZ CECI
    authDomain: "gestionabsences-15d95.firebaseapp.com",
    projectId: "gestionabsences-15d95",
    storageBucket: "gestionabsences-15d95.firebasestorage.app",
    messagingSenderId: "1004883968724",
    appId: "1:1004883968724:web:d58b5c430cfc9768f97141"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Références aux collections
const usersCol = collection(db, 'users');
const classesCol = collection(db, 'classes');
const studentsCol = collection(db, 'students');
const absencesCol = collection(db, 'absences');

// --- 2. ICÔNES (SVG intégrés) ---
const Icons = {
    School: () => <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>,
    User: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Lock: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    KeyRound: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.586 17.414A2 2 0 0 0 2 18v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-.586-1.414l5.5-5.5a2 2 0 0 0 2.414-2.414l5-5A2 2 0 0 0 20 2h-2a2 2 0 0 0-2 2l-5 5a2 2 0 0 0-2.414 2.414L2.586 17.414z"/></svg>,
    ShieldCheck: ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
    LogOut: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
    UserPlus: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>,
    Users: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    BookOpen: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    Plus: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
    UserCheck: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
    Calendar: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
    Clock: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    Send: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
    Trash2: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
    Filter: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    Search: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    CheckSquare: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    Square: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>,
    GraduationCap: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    FileText: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
    Edit: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
    Save: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    X: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
};

// --- 3. CONSTANTES ET SERVICES (Mise à jour pour Firebase) ---
const APP_NAME = "Absence Manager";
const DEVELOPER_CREDIT = "Developed by Pr Amine OUCHKIR";
const STORAGE_KEYS = {
    CURRENT_USER: 'am_current_user' // On garde seulement la session en local
};
const UserRole = {
    ADMIN: 'ADMIN',
    TEACHER: 'ENSEIGNANT',
    SUPERVISOR: 'SURVEILLANT'
};

// --- 4. SERVICES DATABASE (Firestore) ---

// Vérifie si l'admin existe, sinon le crée
const initDefaultAdmin = async () => {
    try {
        const q = query(usersCol, where("username", "==", "admin"));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            await addDoc(usersCol, {
                username: 'admin',
                password: 'admin123',
                role: UserRole.ADMIN,
                fullName: 'Administrateur Principal'
            });
            console.log("Admin par défaut créé");
        }
    } catch (e) {
        console.error("Erreur init admin:", e);
    }
};

// --- 5. COMPOSANTS (Interface Utilisateur) ---

// --- Écran de Connexion (Modifié pour Async) ---
const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(UserRole.TEACHER);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { initDefaultAdmin(); }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Requête Firestore pour trouver l'utilisateur
            const q = query(usersCol, where("username", "==", username), where("password", "==", password), where("role", "==", role));
            const snapshot = await getDocs(q);
            
            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                onLogin({ id: userDoc.id, ...userDoc.data() });
            } else {
                setError('Identifiants incorrects pour ce rôle.');
            }
        } catch (err) {
            console.error(err);
            setError("Erreur de connexion (Vérifiez votre configuration Firebase).");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8 flex flex-col items-center animate-fade-in-down">
                <div className="bg-white/10 p-4 rounded-full mb-4 backdrop-blur-sm border border-white/20">
                    <Icons.School />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">{APP_NAME}</h1>
                <p className="text-blue-200 text-sm font-medium tracking-wide">{DEVELOPER_CREDIT}</p>
            </div>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Connexion</h2>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'utilisateur</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icons.KeyRound size={18} className="text-gray-400" />
                                </div>
                                <select value={role} onChange={(e) => setRole(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900">
                                    <option value={UserRole.TEACHER}>Enseignant</option>
                                    <option value={UserRole.SUPERVISOR}>Surveillant Général</option>
                                    <option value={UserRole.ADMIN}>Administrateur</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icons.User size={18} className="text-gray-400" />
                                </div>
                                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" placeholder="Entrez votre identifiant" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icons.Lock size={18} className="text-gray-400" />
                                </div>
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900" placeholder="••••••••" />
                            </div>
                        </div>
                        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{error}</div>}
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Chargement...' : 'Se connecter'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-8 text-blue-300 text-xs">&copy; 2026 - Maroc</div>
        </div>
    );
};

// --- Composant Reutilisable : Gestion Classes (Async) ---
const TeacherClassManager = ({ teacherId, classes, onUpdateClasses }) => {
    const [newClassName, setNewClassName] = useState('');
    const [editingClassId, setEditingClassId] = useState(null);
    const [editName, setEditName] = useState('');

    const teacherClasses = classes.filter(c => c.teacherId === teacherId);

    const handleAddClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;
        try {
            await addDoc(classesCol, { name: newClassName, teacherId: teacherId });
            setNewClassName('');
            // Pas besoin de onUpdateClasses car on utilise onSnapshot dans le parent
        } catch (e) { console.error(e); }
    };

    const startEditing = (cls) => {
        setEditingClassId(cls.id);
        setEditName(cls.name);
    };

    const saveEdit = async (id) => {
        if (!editName.trim()) return;
        try {
            await updateDoc(doc(db, 'classes', id), { name: editName });
            setEditingClassId(null);
        } catch(e) { console.error(e); }
    };

    return (
        <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Classes attribuées</h4>
            <div className="space-y-2 mb-3">
                {teacherClasses.length > 0 ? (
                    teacherClasses.map(cls => (
                        <div key={cls.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm border border-gray-100">
                            {editingClassId === cls.id ? (
                                <div className="flex items-center flex-1 gap-2">
                                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 text-sm border-gray-300 rounded p-1 border" />
                                    <button onClick={() => saveEdit(cls.id)} className="text-green-600 hover:text-green-800"><Icons.Save size={16}/></button>
                                    <button onClick={() => setEditingClassId(null)} className="text-gray-400 hover:text-gray-600"><Icons.X size={16}/></button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-sm font-medium text-gray-800">{cls.name}</span>
                                    <button onClick={() => startEditing(cls)} className="text-blue-400 hover:text-blue-600 p-1"><Icons.Edit size={14} /></button>
                                </>
                            )}
                        </div>
                    ))
                ) : <p className="text-xs text-gray-400 italic">Aucune classe.</p>}
            </div>
            <form onSubmit={handleAddClass} className="flex gap-2">
                <input type="text" placeholder="Ajouter classe (ex: 1BAC SC 2)" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="flex-1 text-sm border-gray-300 rounded p-2 border" />
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700">+</button>
            </form>
        </div>
    );
};


// --- Dashboard Admin (Async) ---
const AdminDashboard = ({ user, onLogout }) => {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState(UserRole.TEACHER);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [expandedTeacherId, setExpandedTeacherId] = useState(null);

    // Écoute temps réel
    useEffect(() => {
        const unsubUsers = onSnapshot(usersCol, (snapshot) => {
            setUsers(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
        });
        const unsubClasses = onSnapshot(classesCol, (snapshot) => {
            setClasses(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
        });
        return () => { unsubUsers(); unsubClasses(); };
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setSuccessMsg(''); setErrorMsg('');
        
        // Vérification locale doublon (simplifiée)
        if (users.some(u => u.username === newUsername)) {
            setErrorMsg("Ce nom d'utilisateur existe déjà.");
            return;
        }

        try {
            await addDoc(usersCol, {
                username: newUsername,
                password: newPassword, // Note: En prod, ne pas stocker en clair
                fullName: newName,
                role: newRole
            });
            setSuccessMsg(`Utilisateur ${newUsername} ajouté.`);
            setNewUsername(''); setNewPassword(''); setNewName('');
        } catch (e) {
            setErrorMsg("Erreur lors de l'ajout.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20 animate-fade-in">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Icons.ShieldCheck className="text-indigo-600" />
                        <h1 className="text-xl font-bold text-gray-900">Espace Admin (En ligne)</h1>
                    </div>
                    <button onClick={onLogout} className="text-gray-500 hover:text-red-600 transition-colors"><Icons.LogOut size={24} /></button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Formulaire ajout user */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2"><Icons.UserPlus size={20} className="text-indigo-500" /> Ajouter un utilisateur</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label><input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="ex: Ahmed Benani" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label><select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white"><option value={UserRole.TEACHER}>Enseignant</option><option value={UserRole.SUPERVISOR}>Surveillant Général</option></select></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label><input type="text" required value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="ex: prof.ahmed" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label><input type="text" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm p-2 border" placeholder="Définir un mot de passe" /></div>
                            </div>
                            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
                            {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
                            <div className="flex justify-end pt-2"><button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium">Créer le compte</button></div>
                        </form>
                    </div>
                </div>
                {/* Liste Users */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2"><Icons.Users size={20} className="text-gray-500" /> Utilisateurs existants</h2>
                        <span className="text-sm font-medium bg-gray-100 text-gray-600 py-1 px-3 rounded-full">{users.length} total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom & Identifiant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle / Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((u) => (
                                    <React.Fragment key={u.id}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{u.fullName}</div>
                                                <div className="text-sm text-gray-500">{u.username}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : u.role === UserRole.TEACHER ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{u.role}</span>
                                                    {u.role === UserRole.TEACHER && (
                                                        <button 
                                                            onClick={() => setExpandedTeacherId(expandedTeacherId === u.id ? null : u.id)}
                                                            className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-100 transition-colors"
                                                        >
                                                            {expandedTeacherId === u.id ? 'Fermer' : 'Gérer Classes'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedTeacherId === u.id && (
                                            <tr className="bg-indigo-50/30">
                                                <td colSpan="3" className="px-6 py-4">
                                                    <TeacherClassManager teacherId={u.id} classes={classes} onUpdateClasses={() => {}} />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Dashboard Professeur (Async) ---
const TeacherDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('absences');
    const [allClasses, setAllClasses] = useState([]);
    const [myClasses, setMyClasses] = useState([]);
    
    // New Class State
    const [newClassName, setNewClassName] = useState('');
    
    // Absence Form State
    const [selectedClassId, setSelectedClassId] = useState('');
    const [allStudents, setAllStudents] = useState([]);
    const [classStudents, setClassStudents] = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState(null);

    // Écoute temps réel
    useEffect(() => {
        const unsubClasses = onSnapshot(classesCol, (snap) => {
            setAllClasses(snap.docs.map(d => ({id: d.id, ...d.data()})));
        });
        const unsubStudents = onSnapshot(studentsCol, (snap) => {
            setAllStudents(snap.docs.map(d => ({id: d.id, ...d.data()})));
        });
        return () => { unsubClasses(); unsubStudents(); };
    }, []);

    useEffect(() => {
        setMyClasses(allClasses.filter(c => c.teacherId === user.id));
    }, [allClasses, user.id]);

    useEffect(() => {
        if (selectedClassId) {
            const filtered = allStudents.filter(s => s.classId === selectedClassId);
            filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
            setClassStudents(filtered);
            setSelectedStudentIds(new Set());
        } else {
            setClassStudents([]);
        }
    }, [selectedClassId, allStudents]);

    const handleAddClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;
        try {
            await addDoc(classesCol, { name: newClassName, teacherId: user.id });
            setNewClassName('');
            setActiveTab('absences');
        } catch(e) { console.error(e); }
    };

    const toggleStudentSelection = (studentId) => {
        const newSelection = new Set(selectedStudentIds);
        if (newSelection.has(studentId)) {
            newSelection.delete(studentId);
        } else {
            newSelection.add(studentId);
        }
        setSelectedStudentIds(newSelection);
    };

    const handleSendAbsence = async (e) => {
        e.preventDefault();
        setFeedbackMsg(null);

        if (!selectedClassId || !date || !startTime || !endTime) {
            setFeedbackMsg({ type: 'error', text: 'Veuillez remplir les informations de date et d\'heure.' });
            return;
        }

        if (selectedStudentIds.size === 0) {
            setFeedbackMsg({ type: 'error', text: 'Veuillez sélectionner au moins un élève absent.' });
            return;
        }

        const classObj = myClasses.find(c => c.id === selectedClassId);
        if (!classObj) return;

        const timestamp = Date.now();
        let count = 0;

        try {
            const promises = Array.from(selectedStudentIds).map(studentId => {
                const student = classStudents.find(s => s.id === studentId);
                if (student) {
                    const absence = {
                        studentName: student.fullName,
                        date,
                        startTime,
                        endTime,
                        classId: selectedClassId,
                        className: classObj.name,
                        teacherId: user.id,
                        teacherName: user.fullName,
                        timestamp: timestamp + count++
                    };
                    return addDoc(absencesCol, absence);
                }
            });
            await Promise.all(promises);
            setSelectedStudentIds(new Set());
            setFeedbackMsg({ type: 'success', text: `${count} absences envoyées avec succès.` });
            setTimeout(() => setFeedbackMsg(null), 3000);
        } catch(e) {
            console.error(e);
            setFeedbackMsg({ type: 'error', text: "Erreur d'envoi." });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col animate-fade-in">
            <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div><h1 className="text-lg font-bold">Espace Professeur</h1><p className="text-xs text-blue-200">Bonjour, {user.fullName}</p></div>
                    <button onClick={onLogout} className="p-2 bg-blue-800 rounded-full hover:bg-blue-600 transition-colors"><Icons.LogOut size={20} /></button>
                </div>
            </header>
            <div className="bg-white shadow border-b border-gray-200 sticky top-14 z-10">
                <div className="max-w-3xl mx-auto flex">
                    <button onClick={() => setActiveTab('absences')} className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'absences' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Saisir une absence</button>
                    <button onClick={() => setActiveTab('classes')} className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'classes' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Mes Classes</button>
                </div>
            </div>
            <main className="flex-1 max-w-3xl mx-auto w-full p-4">
                {activeTab === 'absences' && (
                    <div className="space-y-6 animate-fade-in">
                        {myClasses.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                                <Icons.BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune classe configurée</h3>
                                <p className="text-gray-500 mb-6">Vous devez d'abord ajouter les classes que vous enseignez.</p>
                                <button onClick={() => setActiveTab('classes')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Ajouter une classe</button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100"><h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2"><Icons.UserCheck className="text-blue-600" size={20} /> Nouvelle Absence</h2></div>
                                <form onSubmit={handleSendAbsence} className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Classe</label><select required value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="block w-full border-gray-300 rounded-lg shadow-sm p-3 border bg-gray-50"><option value="">-- Sélectionner une classe --</option>{myClasses.map(cls => (<option key={cls.id} value={cls.id}>{cls.name}</option>))}</select></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Calendar size={18} className="text-gray-400" /></div><input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="block w-full pl-10 border-gray-300 rounded-lg shadow-sm p-3 border" /></div></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">De</label><input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="block w-full border-gray-300 rounded-lg shadow-sm p-3 border" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">À</label><input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="block w-full border-gray-300 rounded-lg shadow-sm p-3 border" /></div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Cochez les élèves absents :</label>
                                        {selectedClassId ? (
                                            classStudents.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                                                    {classStudents.map(student => {
                                                        const isSelected = selectedStudentIds.has(student.id);
                                                        return (
                                                            <div key={student.id} onClick={() => toggleStudentSelection(student.id)} className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-red-50 border border-red-200' : 'bg-white border border-transparent hover:bg-gray-100'}`}>
                                                                <div className={`mr-3 ${isSelected ? 'text-red-600' : 'text-gray-400'}`}>{isSelected ? <Icons.CheckSquare size={20} /> : <Icons.Square size={20} />}</div>
                                                                <span className={`text-sm font-medium ${isSelected ? 'text-red-800' : 'text-gray-700'}`}>{student.fullName}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (<div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">Cette classe ne contient aucun élève. Veuillez contacter le surveillant général.</div>)
                                        ) : (<div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">Veuillez d'abord sélectionner une classe ci-dessus.</div>)}
                                    </div>
                                    {feedbackMsg && (<div className={`p-3 rounded-lg text-sm text-center font-medium ${feedbackMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{feedbackMsg.text}</div>)}
                                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg"><Icons.Send size={24} /> Envoyer au Surveillant</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'classes' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Icons.Plus size={20} className="text-blue-600" /> Ajouter une nouvelle classe</h2>
                            <form onSubmit={handleAddClass} className="flex gap-3"><input type="text" required value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="ex: 2ème BAC PC 1" className="flex-1 border-gray-300 rounded-lg shadow-sm p-3 border" /><button type="submit" className="bg-gray-900 text-white px-6 rounded-lg font-medium hover:bg-gray-800">Ajouter</button></form>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100"><h3 className="font-medium text-gray-700">Vos classes configurées</h3></div>
                            {myClasses.length > 0 ? (<ul className="divide-y divide-gray-100">{myClasses.map(cls => (<li key={cls.id} className="p-4 flex items-center justify-between hover:bg-gray-50"><span className="font-medium text-gray-800 text-lg">{cls.name}</span></li>))}</ul>) : (<div className="p-8 text-center text-gray-500">Aucune classe ajoutée pour le moment.</div>)}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- Dashboard Surveillant (Async) ---
const SupervisorDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('absences');
    
    // --- Absence State ---
    const [absences, setAbsences] = useState([]);
    const [filteredAbsences, setFilteredAbsences] = useState([]);
    const [filterTeacher, setFilterTeacher] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    // Data Lists
    const [teachersList, setTeachersList] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [students, setStudents] = useState([]);

    // --- Student Management State ---
    const [selectedClassForStudent, setSelectedClassForStudent] = useState('');
    const [newStudentName, setNewStudentName] = useState('');
    const [studentSuccessMsg, setStudentSuccessMsg] = useState('');
    
    // --- Bulk Import State ---
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [bulkStudentNames, setBulkStudentNames] = useState('');

    // --- Teacher Management State ---
    const [allTeachers, setAllTeachers] = useState([]);

    // Écoute temps réel globale
    useEffect(() => {
        const unsubAbsences = onSnapshot(absencesCol, (s) => setAbsences(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a,b) => b.timestamp - a.timestamp)));
        const unsubUsers = onSnapshot(usersCol, (s) => {
            const data = s.docs.map(d => ({id: d.id, ...d.data()}));
            const teachers = data.filter(u => u.role === UserRole.TEACHER);
            setTeachersList(teachers);
            setAllTeachers(teachers);
        });
        const unsubClasses = onSnapshot(classesCol, (s) => setClassesList(s.docs.map(d => ({id: d.id, ...d.data()}))));
        const unsubStudents = onSnapshot(studentsCol, (s) => setStudents(s.docs.map(d => ({id: d.id, ...d.data()}))));

        return () => { unsubAbsences(); unsubUsers(); unsubClasses(); unsubStudents(); };
    }, []);

    useEffect(() => { applyFilters(); }, [absences, filterTeacher, filterClass, filterDate]);

    const applyFilters = () => {
        let result = absences;
        if (filterTeacher) result = result.filter(a => a.teacherName === filterTeacher);
        if (filterClass) result = result.filter(a => a.className === filterClass);
        if (filterDate) result = result.filter(a => a.date === filterDate);
        setFilteredAbsences(result);
    };
    
    const handleDeleteOne = async (id) => { if (window.confirm('Voulez-vous supprimer cette absence ?')) { await deleteDoc(doc(db, 'absences', id)); } };
    
    const handleClearAll = async () => { 
        if (window.confirm('ATTENTION: Voulez-vous supprimer TOUTES les absences ?')) {
            // Firestore ne supporte pas le delete de collection en une fois client-side facilement, on boucle
            const snap = await getDocs(absencesCol);
            snap.forEach(d => deleteDoc(d.ref));
        } 
    };

    // --- Student Management Logic ---
    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!selectedClassForStudent) return;

        if (isBulkMode) {
            if (!bulkStudentNames.trim()) return;
            const lines = bulkStudentNames.split('\n');
            let count = 0;
            const promises = [];
            lines.forEach(line => {
                const cleanLine = line.trim();
                if (cleanLine) {
                    const parts = cleanLine.split(/[\t]+/).map(p => p.trim()).filter(p => p);
                    const fullName = parts.join(' '); 
                    if (fullName) {
                        promises.push(addDoc(studentsCol, { fullName, classId: selectedClassForStudent }));
                        count++;
                    }
                }
            });
            await Promise.all(promises);
            setBulkStudentNames('');
            setStudentSuccessMsg(`${count} élèves ajoutés avec succès !`);
        } else {
            if (!newStudentName.trim()) return;
            await addDoc(studentsCol, { fullName: newStudentName.trim(), classId: selectedClassForStudent });
            setNewStudentName('');
            setStudentSuccessMsg('Élève ajouté avec succès.');
        }
        setTimeout(() => setStudentSuccessMsg(''), 3000);
    };

    const handleDeleteStudent = async (id) => { if(window.confirm('Supprimer cet élève ?')) { await deleteDoc(doc(db, 'students', id)); } };

    const displayedStudents = selectedClassForStudent ? students.filter(s => s.classId === selectedClassForStudent) : [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
            <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div><h1 className="text-lg font-bold">Espace Surveillant</h1><p className="text-xs text-orange-100">Gestion globale (Cloud)</p></div>
                    <button onClick={onLogout} className="p-2 bg-orange-700 rounded-full hover:bg-orange-800 transition-colors"><Icons.LogOut size={20} /></button>
                </div>
            </header>
            <div className="bg-white shadow border-b border-gray-200 sticky top-14 z-10">
                <div className="max-w-5xl mx-auto flex overflow-x-auto">
                    <button onClick={() => setActiveTab('absences')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'absences' ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Absences</button>
                    <button onClick={() => setActiveTab('teachers')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'teachers' ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Professeurs</button>
                    <button onClick={() => setActiveTab('students')} className={`flex-1 min-w-[100px] py-3 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'students' ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Élèves</button>
                </div>
            </div>
            <main className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-4">
                {activeTab === 'absences' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="col-span-2 sm:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4"><div className="bg-orange-100 p-3 rounded-full text-orange-600"><Icons.Users size={24} /></div><div><p className="text-sm text-gray-500">Total Absences</p><p className="text-2xl font-bold text-gray-900">{filteredAbsences.length}</p></div></div>
                            <div className="col-span-2 sm:col-span-1"><button onClick={handleClearAll} className="w-full h-full min-h-[80px] bg-red-50 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 flex flex-col items-center justify-center gap-1"><Icons.Trash2 size={20} /><span className="text-xs font-bold">Tout Effacer</span></button></div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <button onClick={() => setShowFilters(!showFilters)} className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-gray-700 font-medium hover:bg-gray-100"><div className="flex items-center gap-2"><Icons.Filter size={18} /> Filtrer les résultats</div><span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{showFilters ? 'Masquer' : 'Afficher'}</span></button>
                            {showFilters && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Professeur</label>
                                        <div className="relative">
                                            <Icons.Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
                                            <select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)} className="w-full pl-8 p-2 text-sm border border-gray-300 rounded-lg focus:ring-orange-500 bg-white"><option value="">Tous les professeurs</option>{teachersList.map(t => (<option key={t.id} value={t.fullName}>{t.fullName}</option>))}</select>
                                        </div>
                                    </div>
                                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">Classe</label><select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-orange-500 bg-white"><option value="">Toutes les classes</option>{classesList.map(c => (<option key={c.id} value={c.name}>{c.name}</option>))}</select></div>
                                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">Date</label><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-orange-500" /></div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            {filteredAbsences.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200 border-dashed"><Icons.Users size={48} className="mx-auto mb-3 opacity-20" /><p>Aucune absence trouvée.</p></div>
                            ) : (
                                filteredAbsences.map((absence) => (
                                    <div key={absence.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative hover:shadow-md transition-shadow">
                                        <button onClick={() => handleDeleteOne(absence.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-1"><Icons.Trash2 size={18} /></button>
                                        <div className="pr-8">
                                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2"><h3 className="text-lg font-bold text-gray-900">{absence.studentName}</h3><span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">{absence.className}</span></div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-600">
                                                <div className="flex items-center gap-2"><Icons.Calendar size={14} className="text-orange-500" /> {new Date(absence.date).toLocaleDateString('fr-FR')}</div>
                                                <div className="flex items-center gap-2"><Icons.Clock size={14} className="text-orange-500" /> {absence.startTime} - {absence.endTime}</div>
                                                <div className="flex items-center gap-2 sm:col-span-2"><Icons.Users size={14} className="text-orange-500" /><span className="font-medium">Prof. {absence.teacherName}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'teachers' && (
                    <div className="animate-fade-in space-y-6">
                        {/* Teacher List & Class Management */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100"><h3 className="font-medium text-gray-700">Liste des Professeurs et leurs Classes</h3></div>
                            <div className="divide-y divide-gray-100">
                                {teachersList.length > 0 ? teachersList.map(teacher => (
                                    <div key={teacher.id} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{teacher.fullName}</h4>
                                                <span className="text-xs text-gray-500">ID: {teacher.username}</span>
                                            </div>
                                        </div>
                                        {/* Class Manager Component */}
                                        <TeacherClassManager teacherId={teacher.id} classes={classesList} onUpdateClasses={() => {}} />
                                    </div>
                                )) : <div className="p-6 text-center text-gray-500">Aucun professeur enregistré.</div>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    {isBulkMode ? <Icons.FileText size={20} className="text-orange-600" /> : <Icons.UserPlus size={20} className="text-orange-600" />} 
                                    {isBulkMode ? 'Ajout en masse (Liste Excel)' : 'Ajouter un élève'}
                                </h2>
                                <button 
                                    onClick={() => setIsBulkMode(!isBulkMode)}
                                    className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium hover:bg-orange-200 transition-colors"
                                >
                                    {isBulkMode ? 'Passer en mode Unique' : 'Passer en mode Liste'}
                                </button>
                            </div>
                            
                            <form onSubmit={handleAddStudent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner une classe</label>
                                    <select value={selectedClassForStudent} onChange={(e) => setSelectedClassForStudent(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 bg-white" required><option value="">-- Choisir la classe --</option>{classesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                                </div>
                                
                                {isBulkMode ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Coller la liste (Nom et Prénom, ou deux colonnes Excel)</label>
                                        <textarea 
                                            value={bulkStudentNames} 
                                            onChange={(e) => setBulkStudentNames(e.target.value)} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 min-h-[150px]"
                                            placeholder={"Benani [Tab] Ahmed\nAlami [Tab] Sarah\n..."}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Vous pouvez copier directement deux colonnes (Nom/Prénom) depuis Excel et les coller ici.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom et Prénom de l'élève</label>
                                        <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500" placeholder="ex: Yassine Alami" required />
                                    </div>
                                )}

                                {studentSuccessMsg && <p className="text-green-600 text-sm font-medium animate-pulse">{studentSuccessMsg}</p>}
                                <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700">
                                    {isBulkMode ? 'Importer la liste' : 'Ajouter à la liste'}
                                </button>
                            </form>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-medium text-gray-700">Liste des élèves</h3>
                                {selectedClassForStudent && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{displayedStudents.length} élèves</span>
                                )}
                            </div>
                            {selectedClassForStudent ? (
                                displayedStudents.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {displayedStudents.map(student => (
                                            <li key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                                <div className="flex items-center gap-3"><div className="bg-blue-100 p-2 rounded-full text-blue-600"><Icons.GraduationCap size={16} /></div><span className="font-medium text-gray-800">{student.fullName}</span></div>
                                                <button onClick={() => handleDeleteStudent(student.id)} className="text-gray-400 hover:text-red-500"><Icons.Trash2 size={18} /></button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (<div className="p-8 text-center text-gray-500">Aucun élève dans cette classe.</div>)
                            ) : (<div className="p-8 text-center text-gray-400">Veuillez sélectionner une classe dans le formulaire d'ajout pour voir la liste.</div>)}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// --- Composant Principal (App) ---
const App = () => {
    const [currentUser, setCurrentUser] = useState(null);

    // Persistance session simple via localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    };

    if (!currentUser) return <Login onLogin={handleLogin} />;
    return (
        <React.Fragment>
            {currentUser.role === UserRole.ADMIN && <AdminDashboard user={currentUser} onLogout={handleLogout} />}
            {currentUser.role === UserRole.TEACHER && <TeacherDashboard user={currentUser} onLogout={handleLogout} />}
            {currentUser.role === UserRole.SUPERVISOR && <SupervisorDashboard user={currentUser} onLogout={handleLogout} />}
        </React.Fragment>
    );
};

// --- Lancement de l'application ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
