const { useState, useEffect } = React;

// --- 1. ICÔNES ---
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
    Search: ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
};

// --- 2. CONSTANTES ET CONFIGURATION ---
const APP_NAME = "Absence Manager";
const DEVELOPER_CREDIT = "Developed by Amine OUCHKIR";
const STORAGE_KEYS = {
    USERS: 'am_users',
    CLASSES: 'am_classes',
    ABSENCES: 'am_absences',
    CURRENT_USER: 'am_current_user'
};
const UserRole = {
    ADMIN: 'ADMIN',
    TEACHER: 'ENSEIGNANT',
    SUPERVISOR: 'SURVEILLANT'
};

// --- 3. SERVICES (Gestion des données) ---
const initStorage = () => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!users) {
        const defaultAdmin = {
            id: 'admin-001',
            username: 'admin',
            password: 'admin123',
            role: UserRole.ADMIN,
            fullName: 'Administrateur Principal'
        };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultAdmin]));
    }
};

const getUsers = () => {
    initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
};

const addUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const getClasses = () => {
    const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return data ? JSON.parse(data) : [];
};

const addClass = (cls) => {
    const classes = getClasses();
    classes.push(cls);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
};

const getAbsences = () => {
    const data = localStorage.getItem(STORAGE_KEYS.ABSENCES);
    return data ? JSON.parse(data) : [];
};

const addAbsence = (absence) => {
    const list = getAbsences();
    list.push(absence);
    localStorage.setItem(STORAGE_KEYS.ABSENCES, JSON.stringify(list));
};

const removeAbsence = (id) => {
    let list = getAbsences();
    list = list.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ABSENCES, JSON.stringify(list));
};

const clearAllAbsences = () => {
    localStorage.setItem(STORAGE_KEYS.ABSENCES, JSON.stringify([]));
};

// --- 4. COMPOSANTS (Interface Utilisateur) ---

// --- Écran de Connexion ---
const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(UserRole.TEACHER);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password && u.role === role);
        if (user) {
            onLogin(user);
        } else {
            setError('Nom d\'utilisateur ou mot de passe incorrect pour ce rôle.');
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
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Se connecter</button>
                    </form>
                </div>
            </div>
            <div className="mt-8 text-blue-300 text-xs">&copy; {new Date().getFullYear()} Lycée Qualifiant</div>
        </div>
    );
};

// --- Dashboard Admin ---
const AdminDashboard = ({ user, onLogout }) => {
    const [users, setUsers] = useState([]);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState(UserRole.TEACHER);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => { refreshList(); }, []);
    const refreshList = () => { setUsers(getUsers()); };

    const handleAddUser = (e) => {
        e.preventDefault();
        setSuccessMsg(''); setErrorMsg('');
        if (users.some(u => u.username === newUsername)) {
            setErrorMsg("Ce nom d'utilisateur existe déjà.");
            return;
        }
        const newUser = {
            id: Date.now().toString(),
            username: newUsername,
            password: newPassword,
            fullName: newName,
            role: newRole
        };
        addUser(newUser);
        refreshList();
        setSuccessMsg(`Utilisateur ${newUsername} ajouté avec succès.`);
        setNewUsername(''); setNewPassword(''); setNewName('');
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20 animate-fade-in">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Icons.ShieldCheck className="text-indigo-600" />
                        <h1 className="text-xl font-bold text-gray-900">Espace Admin</h1>
                    </div>
                    <button onClick={onLogout} className="text-gray-500 hover:text-red-600 transition-colors"><Icons.LogOut size={24} /></button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2"><Icons.Users size={20} className="text-gray-500" /> Utilisateurs existants</h2>
                        <span className="text-sm font-medium bg-gray-100 text-gray-600 py-1 px-3 rounded-full">{users.length} total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Identifiant</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th></tr></thead>
                            <tbody className="bg-white divide-y divide-gray-200">{users.map((u) => (<tr key={u.id} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.fullName}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.username}</td><td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : u.role === UserRole.TEACHER ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{u.role}</span></td></tr>))}</tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Dashboard Professeur ---
const TeacherDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('absences');
    const [myClasses, setMyClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [studentName, setStudentName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState(null);

    useEffect(() => { loadClasses(); }, [user.id]);
    const loadClasses = () => {
        const allClasses = getClasses();
        setMyClasses(allClasses.filter(c => c.teacherId === user.id));
    };

    const handleAddClass = (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;
        const newClass = { id: Date.now().toString(), name: newClassName, teacherId: user.id };
        addClass(newClass);
        loadClasses();
        setNewClassName('');
        setActiveTab('absences');
    };

    const handleSendAbsence = (e) => {
        e.preventDefault();
        setFeedbackMsg(null);
        if (!selectedClassId || !studentName || !date || !startTime || !endTime) {
            setFeedbackMsg({ type: 'error', text: 'Veuillez remplir tous les champs.' });
            return;
        }
        const classObj = myClasses.find(c => c.id === selectedClassId);
        if (!classObj) return;
        const absence = { id: Date.now().toString(), studentName, date, startTime, endTime, classId: selectedClassId, className: classObj.name, teacherId: user.id, teacherName: user.fullName, timestamp: Date.now() };
        addAbsence(absence);
        setStudentName('');
        setFeedbackMsg({ type: 'success', text: 'Absence envoyée avec succès au surveillant général.' });
        setTimeout(() => setFeedbackMsg(null), 3000);
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
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Classe</label><select required value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="block w-full border-gray-300 rounded-lg shadow-sm p-3 border bg-gray-50"><option value="">-- Sélectionner une classe --</option>{myClasses.map(cls => (<option key={cls.id} value={cls.id}>{cls.name}</option>))}</select></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'élève</label><input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Nom complet de l'élève" className="block w-full border-gray-300 rounded-lg shadow-sm p-3 border" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Calendar size={18} className="text-gray-400" /></div><input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="block w-full pl-10 border-gray-300 rounded-lg shadow-sm p-3 border" /></div></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">De</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Clock size={18} className="text-gray-400" /></div><input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="block w-full pl-10 border-gray-300 rounded-lg shadow-sm p-3 border" /></div></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">À</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Clock size={18} className="text-gray-400" /></div><input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="block w-full pl-10 border-gray-300 rounded-lg shadow-sm p-3 border" /></div></div>
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

// --- Dashboard Surveillant ---
const SupervisorDashboard = ({ user, onLogout }) => {
    const [absences, setAbsences] = useState([]);
    const [filteredAbsences, setFilteredAbsences] = useState([]);
    const [filterTeacher, setFilterTeacher] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => { loadAbsences(); }, []);
    useEffect(() => { applyFilters(); }, [absences, filterTeacher, filterClass, filterDate]);

    const loadAbsences = () => { setAbsences(getAbsences().reverse()); };
    const applyFilters = () => {
        let result = absences;
        if (filterTeacher) result = result.filter(a => a.teacherName.toLowerCase().includes(filterTeacher.toLowerCase()));
        if (filterClass) result = result.filter(a => a.className.toLowerCase().includes(filterClass.toLowerCase()));
        if (filterDate) result = result.filter(a => a.date === filterDate);
        setFilteredAbsences(result);
    };
    const handleDeleteOne = (id) => { if (window.confirm('Voulez-vous supprimer cette absence ?')) { removeAbsence(id); loadAbsences(); } };
    const handleClearAll = () => { if (window.confirm('ATTENTION: Voulez-vous supprimer TOUTES les absences ?')) { clearAllAbsences(); loadAbsences(); } };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
            <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div><h1 className="text-lg font-bold">Espace Surveillant</h1><p className="text-xs text-orange-100">Gestion des absences</p></div>
                    <button onClick={onLogout} className="p-2 bg-orange-700 rounded-full hover:bg-orange-800 transition-colors"><Icons.LogOut size={20} /></button>
                </div>
            </header>
            <main className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="col-span-2 sm:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4"><div className="bg-orange-100 p-3 rounded-full text-orange-600"><Icons.Users size={24} /></div><div><p className="text-sm text-gray-500">Total Absences</p><p className="text-2xl font-bold text-gray-900">{filteredAbsences.length}</p></div></div>
                    <div className="col-span-2 sm:col-span-1"><button onClick={handleClearAll} className="w-full h-full min-h-[80px] bg-red-50 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 flex flex-col items-center justify-center gap-1"><Icons.Trash2 size={20} /><span className="text-xs font-bold">Tout Effacer</span></button></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <button onClick={() => setShowFilters(!showFilters)} className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-gray-700 font-medium hover:bg-gray-100"><div className="flex items-center gap-2"><Icons.Filter size={18} /> Filtrer les résultats</div><span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{showFilters ? 'Masquer' : 'Afficher'}</span></button>
                    {showFilters && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
                            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Professeur</label><div className="relative"><Icons.Search className="absolute left-2 top-2.5 text-gray-400" size={14} /><input type="text" value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)} placeholder="Chercher..." className="w-full pl-8 p-2 text-sm border border-gray-300 rounded-lg focus:ring-orange-500" /></div></div>
                            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Classe</label><input type="text" value={filterClass} onChange={(e) => setFilterClass(e.target.value)} placeholder="ex: 2ème BAC..." className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-orange-500" /></div>
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
            </main>
        </div>
    );
};

// --- Composant Principal (App) ---
const App = () => {
    const [currentUser, setCurrentUser] = useState(null);

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