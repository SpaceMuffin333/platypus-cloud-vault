import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CLOUD ENGINE ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateId = () => `PG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const GEM_DATA = {
    varieties: ["Diamond", "Sapphire", "Ruby", "Emerald", "Alexandrite", "Amethyst", "Aquamarine", "Citrine", "Garnet", "Morganite", "Opal", "Peridot", "Spinel", "Tanzanite", "Topaz", "Tourmaline", "Zircon"],
    cuts: ["Round Brilliant", "Oval", "Cushion", "Emerald Cut", "Princess", "Pear", "Marquise", "Radiant", "Asscher", "Heart", "Baguette", "Trillion", "Cabochon"],
    colors: ["D-F (Colorless)", "G-J (Near Colorless)", "Pigeon Blood Red", "Royal Blue", "Cornflower Blue", "Padparadscha", "Vivid Green", "Deep Purple", "Teal", "Pink", "Yellow", "Bi-Color"],
    clarity: ["FL (Flawless)", "IF (Internally Flawless)", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "Eye Clean", "Lightly Included", "Heavily Included"],
    treatments: ["Unheated", "Heated", "H (Heated)", "H(a) (Flux)", "H(b) (Beryllium)", "Oiled", "Irradiated", "Diffusion", "Glass Filled", "None"]
};

// --- ICONS ---
const IconPlatypus = ({ className = "w-8 h-8" }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="logo-path" d="M20 50C20 35 35 25 55 25C75 25 85 35 85 50C85 65 75 75 55 75C35 75 20 65 20 50Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 55C10 55 5 45 5 40C5 35 12 35 20 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M85 45C92 45 96 48 96 52C96 56 92 59 85 59" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="72" cy="42" r="2.5" fill="currentColor" />
        <path d="M55 40L58 50L68 53L58 56L55 66L52 56L42 53L52 50L55 40Z" fill="#10b981" />
    </svg>
);
const IconAsc = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 text-emerald-500 mb-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg>;
const IconDesc = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 text-emerald-500 mb-0.5"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconLabel = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" x2="7.01" y1="7" y2="7"></line></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const IconLogOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

const defaultGemState = {
    sheetNum: '', type: '', color: '', cut: '', clarity: '', weight: '', cost: '', price: '', location: '', notes: '', image: '',
    dimL: '', dimW: '', dimD: '', treatment: '', origin: '', certificate: '', vendor: '', purchaseDate: ''
};

export default function App() {
    // --- AUTHENTICATION STATE ---
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [authError, setAuthError] = useState('');

    const [inventory, setInventory] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('Never');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'sheetNum', direction: 'ascending' }); 
    const [view, setView] = useState('list');
    const [selectedGem, setSelectedGem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newGem, setNewGem] = useState(defaultGemState);

    const fileInputRef = useRef(null);

    // --- CHECK LOGIN STATUS ON LOAD ---
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // --- FETCH DATA ONLY IF LOGGED IN ---
    useEffect(() => {
        if (!session) return;
        
        const fetchGems = async () => {
            const { data, error } = await supabase.from('gems').select('*');
            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setInventory(data || []);
                setIsLoaded(true);
                updateTimestamp();
            }
        };
        fetchGems();
    }, [session]);

    // --- AUTH FUNCTIONS ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoadingAuth(true);
        setAuthError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAuthError(error.message);
        setLoadingAuth(false);
    };

    const handleLogOut = async () => {
        await supabase.auth.signOut();
    };

    const updateTimestamp = () => {
        const d = new Date();
        const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastUpdated(`${dateStr} ${timeStr}`);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('gem-photos').upload(fileName, file);
        if (uploadError) return alert("Error uploading photo: " + uploadError.message);
        const { data: publicUrlData } = supabase.storage.from('gem-photos').getPublicUrl(fileName);
        setNewGem(prev => ({ ...prev, image: publicUrlData.publicUrl }));
    };

    // --- BULK CSV IMPORT WITH GHOSTBUSTER FIX ---
    const importCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) return alert("Invalid or empty CSV file.");

            // GHOSTBUSTER: .replace(/^\uFEFF/, '') removes the invisible Excel character!
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').replace(/^\uFEFF/, ''));
            const parsedGems = [];

            for (let i = 1; i < lines.length; i++) {
                const values = [];
                let inQuotes = false;
                let val = '';
                for (let char of lines[i]) {
                    if (char === '"') inQuotes = !inQuotes;
                    else if (char === ',' && !inQuotes) { values.push(val); val = ''; }
                    else val += char;
                }
                values.push(val);

                const cleanValues = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
                const gem = { ...defaultGemState };
                let hasData = false;

                headers.forEach((header, index) => {
                    const v = cleanValues[index] || '';
                    if (header.includes('Gem Ref #') || header.includes('Sheet Ref #')) gem.sheetNum = v;
                    else if (header.includes('Vault ID')) { gem.id = v; if(v) hasData = true; }
                    else if (header.includes('Variety')) { gem.type = v; if(v) hasData = true; }
                    else if (header.includes('Color')) gem.color = v;
                    else if (header.includes('Cut')) gem.cut = v;
                    else if (header.includes('Clarity')) gem.clarity = v;
                    else if (header.includes('Carats') || header.includes('Weight')) gem.weight = v;
                    else if (header.includes('Length')) gem.dimL = v;
                    else if (header.includes('Width')) gem.dimW = v;
                    else if (header.includes('Depth')) gem.dimD = v;
                    else if (header.includes('Treatment')) gem.treatment = v;
                    else if (header.includes('Origin')) gem.origin = v;
                    else if (header.includes('Certificate')) gem.certificate = v;
                    else if (header.includes('Vendor')) gem.vendor = v;
                    else if (header.includes('Purchase Date')) gem.purchaseDate = v;
                    else if (header.includes('Storage Location')) gem.location = v;
                    else if (header.includes('Cost')) gem.cost = v;
                    else if (header.includes('Market Value') || header.includes('Price')) gem.price = v;
                    else if (header.includes('Private Notes')) gem.notes = v;
                });

                if (hasData && gem.type) {
                    if (!gem.id) gem.id = generateId();
                    parsedGems.push(gem);
                }
            }

            if (parsedGems.length > 0) {
                const { error } = await supabase.from('gems').upsert(parsedGems);
                if (error) {
                    alert("Error saving CSV to cloud: " + error.message);
                    return;
                }
                setInventory(prev => {
                    const newInv = [...prev];
                    parsedGems.forEach(importedGem => {
                        const existingIdx = newInv.findIndex(g => g.id === importedGem.id);
                        if (existingIdx >= 0) newInv[existingIdx] = { ...newInv[existingIdx], ...importedGem };
                        else newInv.unshift(importedGem);
                    });
                    return newInv;
                });
                alert(`Successfully imported ${parsedGems.length} items. Prices and Gem Numbers are restored!`);
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newGem.type) return;
        
        const gemData = { ...newGem };
        if (!gemData.id) gemData.id = generateId();

        const { error } = await supabase.from('gems').upsert(gemData);
        if (error) return alert("Error saving to cloud: " + error.message);

        if (isEditing) {
            setInventory(inventory.map(item => item.id === editId ? gemData : item));
            setIsEditing(false); setEditId(null);
        } else {
            setInventory([gemData, ...inventory]);
        }
        setNewGem(defaultGemState);
        updateTimestamp();
    };

    const startEdit = (gem) => {
        setNewGem({ ...defaultGemState, ...gem });
        setEditId(gem.id); setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => { setNewGem(defaultGemState); setIsEditing(false); setEditId(null); };

    const deleteGem = async (id) => {
        if(window.confirm("Permanently remove this item from your private vault?")) {
            const { error } = await supabase.from('gems').delete().eq('id', id);
            if (error) return alert("Error deleting from cloud: " + error.message);
            setInventory(inventory.filter(g => g.id !== id));
            if (isEditing && editId === id) cancelEdit();
            updateTimestamp();
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (headerKey) => {
        if (sortConfig.key !== headerKey) return null;
        return sortConfig.direction === 'ascending' ? <IconAsc /> : <IconDesc />;
    };

    const formPpc = Number(newGem.weight) > 0 ? formatCurrency(Number(newGem.price) / Number(newGem.weight)) : '0.00';

    // --- LOGIN SCREEN COMPONENT ---
    if (!session) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
                        <div className="flex justify-center mb-4 text-emerald-600"><IconPlatypus className="w-16 h-16" /></div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">Platypus Gems</h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mt-2">Secure Vault Access</p>
                    </div>
                    <form onSubmit={handleLogin} className="p-8 space-y-6">
                        {authError && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg text-center uppercase tracking-wider border border-red-200">{authError}</div>}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium" placeholder="you@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Master Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium" placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loadingAuth} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-200 disabled:opacity-50">
                            {loadingAuth ? 'Unlocking...' : 'Unlock Vault'}
                        </button>
                    </form>
                </div>
                <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 text-center">&copy; Platypus Gems • Cloud Encrypted</p>
            </div>
        );
    }

    // --- MAIN VAULT VIEW ---
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <nav className="bg-slate-900 text-white p-4 px-8 flex justify-between items-center sticky top-0 z-50 no-print shadow-xl">
                <div className="flex items-center gap-4 group cursor-default">
                    <div className="bg-emerald-500/10 p-1.5 rounded-xl text-emerald-400 shadow-inner border border-emerald-500/20 logo-hover transition-all duration-500"><IconPlatypus className="w-10 h-10" /></div>
                    <div className="flex flex-col"><span className="font-black text-2xl italic tracking-tighter uppercase leading-none">PLATYPUS GEMS</span><span className="text-[9px] font-bold text-emerald-500 tracking-[0.3em] uppercase opacity-70">Privé Inventory Vault</span></div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vault Sync State</p><p className="text-xs font-mono text-emerald-400 uppercase tracking-tighter">Ready • {lastUpdated}</p></div>
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-bold border border-emerald-500/20 tracking-widest uppercase flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>Secure Mode
                    </div>
                    <button onClick={handleLogOut} className="flex items-center gap-2 text-[10px] font-bold text-slate-300 hover:text-white uppercase tracking-widest transition-colors border-l border-slate-700 pl-6 ml-2">
                        <IconLogOut /> Exit Vault
                    </button>
                </div>
            </nav>
            
            <div className="max-w-[90rem] mx-auto p-6 space-y-8 no-print">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
                <div className="w-full md:w-1/3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Search Vault</label>
                    <input 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="Search variety, color, origin, sheet # or ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-3 items-center justify-end mt-4 md:mt-0">
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={importCSV} className="hidden" />
                    
                    <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg hover:bg-indigo-100 uppercase tracking-tighter border border-indigo-100 transition-colors">
                        <IconUpload /> Import CSV
                    </button>
                    
                    <div className="text-right border-l pl-4 border-slate-200 ml-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Vault Value</p>
                        <p className="text-2xl font-black text-emerald-600">${formatCurrency(inventory.reduce((sum, g) => sum + (Number(g.price) || 0), 0))}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 lg:col-span-3 xl:col-span-3">
                    <div className={`p-5 rounded-2xl shadow-sm border transition-all sticky top-24 max-h-[85vh] overflow-y-auto ${isEditing ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">{isEditing ? 'Update Profile' : 'Gem Registration'}</h2>
                            {isEditing && <button type="button" onClick={cancelEdit} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Cancel</button>}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <datalist id="gem-varieties">{GEM_DATA.varieties.map(v => <option key={v} value={v} />)}</datalist>
                            <datalist id="gem-cuts">{GEM_DATA.cuts.map(v => <option key={v} value={v} />)}</datalist>
                            <datalist id="gem-colors">{GEM_DATA.colors.map(v => <option key={v} value={v} />)}</datalist>
                            <datalist id="gem-clarity">{GEM_DATA.clarity.map(v => <option key={v} value={v} />)}</datalist>
                            <datalist id="gem-treatments">{GEM_DATA.treatments.map(v => <option key={v} value={v} />)}</datalist>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-px bg-slate-200 flex-grow"></div>
                                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">General</span>
                                    <div className="h-px bg-slate-200 flex-grow"></div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1 space-y-1">
                                        <label className="text-[10px] font-bold text-emerald-600 uppercase">Gem Ref #</label>
                                        <input type="text" className="w-full p-2 border border-emerald-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-emerald-50/30 font-black" placeholder="1-50" value={newGem.sheetNum} onChange={e => setNewGem({...newGem, sheetNum: e.target.value})} />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Variety</label>
                                        <input list="gem-varieties" required className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent font-bold" placeholder="Select or type..." value={newGem.type} onChange={e => setNewGem({...newGem, type: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Color</label>
                                        <input list="gem-colors" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="Select or type..." value={newGem.color} onChange={e => setNewGem({...newGem, color: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Cut</label>
                                        <input list="gem-cuts" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="Select or type..." value={newGem.cut} onChange={e => setNewGem({...newGem, cut: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Dimensions (LxWxD mm)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="L" value={newGem.dimL} onChange={e => setNewGem({...newGem, dimL: e.target.value})} />
                                        <input className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="W" value={newGem.dimW} onChange={e => setNewGem({...newGem, dimW: e.target.value})} />
                                        <input className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="D" value={newGem.dimD} onChange={e => setNewGem({...newGem, dimD: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Weight (ct)</label>
                                    <input type="number" step="0.01" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="0.00" value={newGem.weight} onChange={e => setNewGem({...newGem, weight: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2 bg-slate-100/50 p-2 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-widest ml-1">Financial Data</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Cost $</label>
                                        <input type="number" step="0.01" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-white" placeholder="0.00" value={newGem.cost} onChange={e => setNewGem({...newGem, cost: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Market Val $</label>
                                        <input type="number" step="0.01" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-white font-bold text-emerald-700" placeholder="0.00" value={newGem.price} onChange={e => setNewGem({...newGem, price: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] text-white ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-900 hover:bg-black shadow-slate-300'}`}>
                                {isEditing ? 'Update Profile' : 'Save Registration'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8 lg:col-span-9 xl:col-span-9">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="p-4 w-16 sort-header rounded-tl-2xl" onClick={() => requestSort('sheetNum')} title="Sort by Reference Number">
                                        #{renderSortIcon('sheetNum')}
                                    </th>
                                    <th className="p-4">Variety</th>
                                    <th className="p-4 sort-header" onClick={() => requestSort('weight')} title="Sort by Carat Weight">
                                        Profile & Specs{renderSortIcon('weight')}
                                    </th>
                                    <th className="p-4 sort-header" onClick={() => requestSort('price')} title="Sort by Market Value">
                                        Finances ($/ct){renderSortIcon('price')}
                                    </th>
                                    <th className="p-4">Logistics</th>
                                    <th className="p-4 text-right rounded-tr-2xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {inventory.filter(i => {
                                    const search = searchTerm.toLowerCase();
                                    return (
                                        String(i.type||'').toLowerCase().includes(search) || 
                                        String(i.id||'').toLowerCase().includes(search) ||
                                        String(i.color||'').toLowerCase().includes(search) ||
                                        String(i.origin||'').toLowerCase().includes(search) ||
                                        String(i.sheetNum||'').toLowerCase().includes(search)
                                    );
                                }).sort((a, b) => {
                                    let aVal = a[sortConfig.key] || 0;
                                    let bVal = b[sortConfig.key] || 0;
                                    if (['weight', 'price', 'sheetNum'].includes(sortConfig.key)) {
                                        aVal = Number(aVal);
                                        bVal = Number(bVal);
                                    } else {
                                        aVal = String(aVal).toLowerCase();
                                        bVal = String(bVal).toLowerCase();
                                    }
                                    if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                                    if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                                    return 0;
                                }).map(gem => {
                                    const ppcRow = Number(gem.weight) > 0 ? formatCurrency(Number(gem.price) / Number(gem.weight)) : '0.00';
                                    return (
                                    <tr key={gem.id} className={`transition-colors ${editId === gem.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                                        <td className="p-4 align-top">
                                            <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-sm">{gem.sheetNum || '-'}</div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
                                                    {gem.image ? <img src={gem.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><IconCamera /></div>}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-800 uppercase tracking-tight text-[15px]">{gem.type}</div>
                                                    <div className="text-[10px] font-mono text-slate-400 bg-white px-1 border border-slate-100 rounded inline-block mt-1">{gem.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="text-slate-800 font-bold text-sm mb-1">{gem.weight}ct <span className="text-slate-400 font-normal ml-1">{gem.color}</span></div>
                                            <div className="text-[11px] text-slate-500 mb-2">
                                                <span className="bg-slate-100 px-1 rounded">{gem.cut || 'Uncut'}</span>
                                                {gem.dimL && gem.dimW && <span className="ml-2 text-slate-400">{gem.dimL}x{gem.dimW}{gem.dimD ? `x${gem.dimD}` : ''}mm</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="text-emerald-700 font-black text-lg">${formatCurrency(gem.price)}</div>
                                            <div className="text-[11px] text-slate-500 font-medium mt-1">Cost: ${formatCurrency(gem.cost)}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-tighter mt-2 border-t border-slate-100 pt-1">Rate: ${ppcRow}/ct</div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="mb-2"><span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold uppercase tracking-wider">{gem.location || 'Vault'}</span></div>
                                            <div className="text-[10px] text-slate-500"><div className="truncate w-24" title={gem.vendor}>Vnd: {gem.vendor || '-'}</div></div>
                                        </td>
                                        <td className="p-4 text-right align-top">
                                            <div className="flex flex-col items-end gap-2">
                                                <button title="Edit Gem" onClick={() => startEdit(gem)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"><IconEdit /></button>
                                                <button title="Delete" onClick={() => deleteGem(gem.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><IconTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
