import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CLOUD ENGINE ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateId = () => `PG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

// Safe math formatter
const safeNumber = (val) => Number(String(val).replace(/[^0-9.-]+/g,"")) || 0;

const formatCurrency = (value) => {
    return safeNumber(value).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Smart Thumbnail Detector
const isImage = (fileName) => {
    if (!fileName) return false;
    return fileName.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
};

const GEM_DATA = {
    varieties: [
        "Diamond", "Sapphire", "Ruby", "Emerald", "Alexandrite", "Amethyst", 
        "Aquamarine", "Citrine", "Garnet", "Morganite", "Opal", "Peridot", 
        "Spinel", "Tanzanite", "Topaz", "Tourmaline", "Zircon"
    ],
    cuts: [
        "Round Brilliant", "Oval", "Cushion", "Emerald Cut", "Princess", "Pear", 
        "Marquise", "Radiant", "Asscher", "Heart", "Baguette", "Trillion", "Cabochon"
    ],
    colors: [
        "D-F (Colorless)", "G-J (Near Colorless)", "Pigeon Blood Red", "Royal Blue", 
        "Cornflower Blue", "Padparadscha", "Vivid Green", "Deep Purple", "Teal", 
        "Pink", "Yellow", "Bi-Color"
    ],
    clarity: [
        "FL (Flawless)", "IF (Internally Flawless)", "VVS1", "VVS2", "VS1", "VS2", 
        "SI1", "SI2", "I1", "Eye Clean", "Lightly Included", "Heavily Included"
    ],
    treatments: [
        "Unheated", "Heated", "H (Heated)", "H(a) (Flux)", "H(b) (Beryllium)", 
        "Oiled", "Irradiated", "Diffusion", "Glass Filled", "None"
    ]
};

// --- ICONS ---
// HARD LOCKED ORIGINAL LOGO. Flat colors only.
const IconPlatypus = ({ className = "w-8 h-8" }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="logo-path" d="M20 50C20 35 35 25 55 25C75 25 85 35 85 50C85 65 75 75 55 75C35 75 20 65 20 50Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 55C10 55 5 45 5 40C5 35 12 35 20 45" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M85 45C92 45 96 48 96 52C96 56 92 59 85 59" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="72" cy="42" r="2.5" fill="currentColor" />
        <path d="M55 40L58 50L68 53L58 56L55 66L52 56L42 53L52 50L55 40Z" fill="currentColor" />
    </svg>
);
const IconAsc = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 text-emerald-500 mb-0.5"><polyline points="18 15 12 9 6 15"></polyline></svg>;
const IconDesc = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 text-emerald-500 mb-0.5"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconLabel = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" x2="7.01" y1="7" x2="7.01" y1="7"></line></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconCamera = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const IconFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IconLogOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconFolder = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const IconBack = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;

const defaultGemState = {
    sheetNum: '', type: '', color: '', cut: '', clarity: '', weight: '', cost: '', price: '', location: '', notes: '', image: '',
    dimL: '', dimW: '', dimD: '', treatment: '', origin: '', certificate: '', vendor: '', purchaseDate: ''
};

export default function App() {
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
    const [gemAssets, setGemAssets] = useState([]);
    const [isUploadingAsset, setIsUploadingAsset] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newGem, setNewGem] = useState(defaultGemState);
    const [isMobileFormOpen, setIsMobileFormOpen] = useState(false); 

    const fileInputRef = useRef(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session) return;
        const fetchGems = async () => {
            const { data, error } = await supabase.from('gems').select('*');
            if (!error) {
                setInventory(data || []);
                setIsLoaded(true);
                updateTimestamp();
            }
        };
        fetchGems();
    }, [session]);

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
        setLastUpdated(`${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('gem-photos').upload(fileName, file);
        if (uploadError) {
            alert("Error: " + uploadError.message);
            return;
        }
        const { data: publicUrlData } = supabase.storage.from('gem-photos').getPublicUrl(fileName);
        setNewGem(prev => ({ ...prev, image: publicUrlData.publicUrl }));
    };

    const getTimestamp = () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}_${hh}-${min}`;
    };

    const exportCSV = () => {
        if (inventory.length === 0) {
            alert("Nothing to export.");
            return;
        }
        const headers = [
            'Gem Ref #', 'Vault ID', 'Variety', 'Color', 'Cut', 'Clarity', 
            'Carats (ct)', 'Length (mm)', 'Width (mm)', 'Depth (mm)', 
            'Treatment', 'Origin', 'Certificate', 'Vendor', 'Purchase Date', 
            'Storage Location', 'Cost ($)', 'Retail Value ($)', 'Price/ct ($)', 'Private Notes'
        ];
        const csvRows = [headers.join(',')];
        
        inventory.forEach(gem => {
            const pricePerCt = safeNumber(gem.weight) > 0 ? (safeNumber(gem.price) / safeNumber(gem.weight)).toFixed(2) : 0;
            const values = [
                gem.sheetNum || '',
                gem.id,
                `"${(gem.type || '').replace(/"/g, '""')}"`,
                `"${(gem.color || '').replace(/"/g, '""')}"`,
                `"${(gem.cut || '').replace(/"/g, '""')}"`,
                `"${(gem.clarity || '').replace(/"/g, '""')}"`,
                gem.weight || '0',
                gem.dimL || '0',
                gem.dimW || '0',
                gem.dimD || '0',
                `"${(gem.treatment || '').replace(/"/g, '""')}"`,
                `"${(gem.origin || '').replace(/"/g, '""')}"`,
                `"${(gem.certificate || '').replace(/"/g, '""')}"`,
                `"${(gem.vendor || '').replace(/"/g, '""')}"`,
                `"${(gem.purchaseDate || '').replace(/"/g, '""')}"`,
                `"${(gem.location || '').replace(/"/g, '""')}"`,
                gem.cost || '0',
                gem.price || '0',
                pricePerCt,
                `"${(gem.notes || '').replace(/"/g, '""')}"`
            ];
            csvRows.push(values.join(','));
        });
        
        const blob = new Blob(["\ufeff" + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `PG_Inventory_Export_${getTimestamp()}.csv`);
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link);
    };

    const importCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const lines = event.target.result.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
                alert("Invalid file.");
                return;
            }
            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').replace(/^\uFEFF/, ''));
            const parsedGems = [];

            for (let i = 1; i < lines.length; i++) {
                const values = []; let inQuotes = false; let val = '';
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
                    const h = header.toLowerCase();
                    
                    if (h.includes('gem ref') || h.includes('sheet ref')) gem.sheetNum = v;
                    else if (h.includes('vault id')) { gem.id = v; if(v) hasData = true; }
                    else if (h.includes('variety')) { gem.type = v; if(v) hasData = true; }
                    else if (h === 'color') gem.color = v;
                    else if (h === 'cut') gem.cut = v;
                    else if (h === 'clarity') gem.clarity = v;
                    else if (h.includes('carats') || h.includes('weight')) gem.weight = v;
                    else if (h.includes('length')) gem.dimL = v;
                    else if (h.includes('width')) gem.dimW = v;
                    else if (h.includes('depth')) gem.dimD = v;
                    else if (h.includes('treatment')) gem.treatment = v;
                    else if (h.includes('origin')) gem.origin = v;
                    else if (h.includes('certificate')) gem.certificate = v;
                    else if (h.includes('vendor')) gem.vendor = v;
                    else if (h.includes('purchase date')) gem.purchaseDate = v;
                    else if (h.includes('storage location')) gem.location = v;
                    else if (h.includes('cost')) gem.cost = v;
                    else if (h.includes('market value') || h.includes('retail value')) gem.price = v;
                    else if (h.includes('private notes')) gem.notes = v;
                });
                
                if (hasData && gem.type) { 
                    if (!gem.id) gem.id = generateId(); 
                    parsedGems.push(gem); 
                }
            }
            if (parsedGems.length > 0) {
                const { error } = await supabase.from('gems').upsert(parsedGems);
                if (error) {
                    alert("Error: " + error.message);
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
                alert(`Successfully imported ${parsedGems.length} items.`);
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
        if (error) {
            alert("Error saving: " + error.message);
            return;
        }
        if (isEditing) {
            setInventory(inventory.map(item => item.id === editId ? gemData : item));
            setIsEditing(false); 
            setEditId(null);
            setIsMobileFormOpen(false); 
        } else {
            setInventory([gemData, ...inventory]);
            setIsMobileFormOpen(false); 
        }
        setNewGem(defaultGemState); 
        updateTimestamp();
    };

    const startEdit = (gem) => {
        setNewGem({ ...defaultGemState, ...gem });
        setEditId(gem.id); 
        setIsEditing(true);
        setIsMobileFormOpen(true); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => { 
        setNewGem(defaultGemState); 
        setIsEditing(false); 
        setEditId(null); 
        setIsMobileFormOpen(false);
    };

    const deleteGem = async (id) => {
        if(window.confirm("Permanently remove this item from your private vault?")) {
            const { error } = await supabase.from('gems').delete().eq('id', id);
            if (error) {
                alert("Error: " + error.message);
                return;
            }
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

    const formPpc = safeNumber(newGem.weight) > 0 ? formatCurrency(safeNumber(newGem.price) / safeNumber(newGem.weight)) : '0.00';

    // --- DIGITAL FILING CABINET (DETAILS VIEW) FUNCTIONS ---
    const openGemDetails = async (gem) => {
        setSelectedGem(gem);
        setView('details');
        setGemAssets([]); 
        const { data, error } = await supabase.from('gem_assets').select('*').eq('gem_id', gem.id);
        if (!error && data) {
            setGemAssets(data);
        }
    };

    const handleAssetUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedGem) return;
        setIsUploadingAsset(true);
        
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('gem-photos').upload(fileName, file);
        
        if (uploadError) {
            alert("Upload failed: " + uploadError.message);
            setIsUploadingAsset(false);
            return;
        }

        const { data: publicUrlData } = supabase.storage.from('gem-photos').getPublicUrl(fileName);
        
        const newAsset = {
            gem_id: selectedGem.id,
            file_name: file.name,
            file_url: publicUrlData.publicUrl
        };

        const { data, error } = await supabase.from('gem_assets').insert([newAsset]).select();
        if (!error && data) {
            setGemAssets([...gemAssets, data[0]]);
        }
        setIsUploadingAsset(false);
    };

    const deleteAsset = async (assetId) => {
        if(window.confirm("Permanently delete this attached file?")) {
            await supabase.from('gem_assets').delete().eq('id', assetId);
            setGemAssets(gemAssets.filter(a => a.id !== assetId));
        }
    };

    // --- RENDER LOGIN ---
    if (!session) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-emerald-50 rounded-2xl shadow-2xl overflow-hidden border border-emerald-100">
                    <div className="p-8 text-center bg-emerald-50 border-b border-emerald-200/50">
                        {/* THE LOCK SCREEN ELEGANCE FIX:
                            - Outer div handles flat color transitions. Base text-emerald-500.
                            - Hover transition snaps lines to text-purple-800.
                            - Base Box-Shadow: A massive, radiating blur background depth. Zero shadow on the lines themselves (elegance).
                            - Hover Box-Shadow: Increases base background depth by >200%. Stacks a second full-intensity hex (#a855f7) neon blur behind the container.
                        */}
                        <div className="group mx-auto w-max mb-6 cursor-default">
                            <div className="text-emerald-500 shadow-[0_0_20px_#a855f7] rounded-full transition-all duration-500 group-hover:shadow-[0_0_60px_#a855f7] group-hover:text-purple-800 relative">
                                <IconPlatypus className="w-32 h-32" />
                                <div className="absolute inset-0 transition-all duration-500 shadow-[0_0_2px_#a855f7] rounded-full group-hover:shadow-[0_0_15px_#a855f7]"></div>
                            </div>
                        </div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">
                            Platypus Gems
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mt-2 opacity-80">
                            Secure Vault Access
                        </p>
                    </div>
                    <form onSubmit={handleLogin} className="p-8 space-y-6">
                        {authError ? (
                            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg text-center uppercase tracking-wider border border-red-200">
                                {authError}
                            </div>
                        ) : null}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-white/70 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium transition-all" placeholder="you@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Master Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-white/70 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium transition-all" placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loadingAuth} className="w-full py-4 bg-slate-900 text-white hover:text-purple-400 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-md hover:shadow-[0_0_35px_rgba(168,85,247,1)] border border-transparent hover:border-purple-500/50 disabled:opacity-50">
                            {loadingAuth ? 'Unlocking...' : 'Unlock Vault'}
                        </button>
                    </form>
                </div>
                <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 text-center">
                    &copy; Platypus Gems • Cloud Encrypted
                </p>
            </div>
        );
    }

    // --- RENDER LABEL ---
    const renderLabel = () => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedGem.id}`;
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50">
                <div className="bg-white border-2 border-slate-900 p-6 rounded-none w-80 shadow-2xl print:shadow-none print:m-0 relative" id="printable-label">
                    <div className="absolute top-0 right-0 bg-slate-900 text-white px-2 py-1 font-black text-sm">
                        {selectedGem.sheetNum || '-'}
                    </div>
                    <div className="text-center space-y-2 border-b-2 border-slate-900 pb-4 mb-4">
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic">PLATYPUS GEMS</h1>
                        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest italic">Vault Inventory Item</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-4">
                            <img src={qrUrl} className="w-24 h-24" alt="QR" />
                            <div className="text-left space-y-1">
                                <p className="text-sm font-black uppercase tracking-wide">{selectedGem.type}</p>
                                <p className="text-[10px] font-bold text-slate-600">{selectedGem.weight}ct • {selectedGem.cut}</p>
                                {selectedGem.dimL ? (
                                    <p className="text-[9px] text-slate-400">{selectedGem.dimL}x{selectedGem.dimW}x{selectedGem.dimD}mm</p>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div className="w-full aspect-square border border-slate-200 rounded overflow-hidden p-1">
                                {selectedGem.image ? (
                                    <img src={selectedGem.image} className="w-full h-full object-cover rounded-sm" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200 text-xs">NO PHOTO</div>
                                )}
                            </div>
                            <p className="text-[9px] font-mono mt-2 text-slate-400 bg-slate-50 text-center py-1 border border-slate-100">{selectedGem.id}</p>
                        </div>
                    </div>
                    <div className="text-[9px] text-slate-500 border-t border-slate-200 pt-2 mb-2 flex justify-between uppercase">
                        <span>{selectedGem.treatment || 'Treatment Unspec.'}</span>
                        <span>{selectedGem.origin || 'Origin Unspec.'}</span>
                    </div>
                    <div className="border-t-2 border-slate-900 pt-2 mt-2 text-center">
                        <p className="text-[10px] font-black tracking-widest text-slate-800">LOC: {selectedGem.location || 'SECURE VAULT'}</p>
                    </div>
                </div>
                <div className="mt-8 flex gap-4 no-print">
                    <button onClick={() => setView('list')} className="px-6 py-2 border border-slate-300 rounded-xl hover:bg-white transition text-sm font-bold">Back to Inventory</button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition text-sm shadow-lg shadow-emerald-200">Print Label</button>
                </div>
            </div>
        );
    };

    // --- RENDER DIGITAL FILING CABINET (DETAILS) ---
    const renderGemDetails = () => {
        if (!selectedGem) return null;
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-widest transition-colors mb-4">
                    <IconBack /> Back to Main Vault
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="w-full aspect-square bg-slate-100 flex items-center justify-center relative">
                                {selectedGem.image ? (
                                    <img src={selectedGem.image} className="w-full h-full object-cover" alt={selectedGem.type} />
                                ) : (
                                    <IconCamera className="text-slate-300 w-12 h-12" />
                                )}
                                <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-black px-2 py-1 rounded shadow">
                                    #{selectedGem.sheetNum || '-'}
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">{selectedGem.type}</h2>
                                    <p className="text-xs font-mono text-slate-400 mt-1">{selectedGem.id}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-700">{selectedGem.weight}ct <span className="text-slate-500 font-normal">{selectedGem.color}</span></p>
                                    <p className="text-xs text-slate-500">{selectedGem.cut} • {selectedGem.clarity}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Sparkle Tokens</p>
                                    <p className="text-2xl font-black text-emerald-600">${formatCurrency(selectedGem.price)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-black uppercase text-slate-800 flex items-center gap-2">
                                        <IconFolder /> Digital Filing Cabinet
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">Upload valuations, certificates, and extra photos here.</p>
                                </div>
                                <div className="relative">
                                    <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                                        {isUploadingAsset ? 'Uploading...' : (<><IconUpload /> Add File</>)}
                                        <input type="file" className="hidden" onChange={handleAssetUpload} disabled={isUploadingAsset} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {gemAssets.length === 0 && !isUploadingAsset ? (
                                    <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                                        No files attached to this stone yet.
                                    </div>
                                ) : null}
                                
                                {gemAssets.map(asset => (
                                    <div key={asset.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {/* THUMBNAIL DETECTOR LOGIC */}
                                            {isImage(asset.file_name) ? (
                                                <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                    <img src={asset.file_url} alt="preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg flex-shrink-0">
                                                    <IconFileText />
                                                </div>
                                            )}
                                            <a href={asset.file_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-700 hover:text-emerald-600 truncate">
                                                {asset.file_name}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a href={asset.file_url} download target="_blank" rel="noreferrer" title="Download File" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <IconDownload />
                                            </a>
                                            <button onClick={() => deleteAsset(asset.id)} title="Delete File" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDER MAIN INVENTORY ---
    const renderInventory = () => {
        return (
            <div className="max-w-[90rem] mx-auto p-4 md:p-6 space-y-6 md:space-y-8 no-print">
                <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
                    <div className="w-full md:w-1/3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Search Vault</label>
                        <input 
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            placeholder="Search variety, color, origin, shape, sheet # or ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-auto flex flex-wrap gap-3 items-center justify-between md:justify-end mt-2 md:mt-0">
                        <div className="flex gap-2">
                            <input type="file" accept=".csv" ref={fileInputRef} onChange={importCSV} className="hidden" />
                            
                            <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 uppercase tracking-widest border border-indigo-200 transition-colors shadow-sm">
                                <IconUpload /> Import CSV
                            </button>
                            <button onClick={exportCSV} className="flex items-center gap-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 uppercase tracking-widest border border-blue-200 transition-colors shadow-sm">
                                <IconFileText /> Export CSV
                            </button>
                        </div>
                        
                        <div className="text-right border-l border-slate-200 pl-4 ml-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vault Value</p>
                            <p className="text-xl font-black text-emerald-600">${formatCurrency(inventory.reduce((sum, g) => sum + safeNumber(g.price), 0))}</p>
                        </div>
                    </div>
                </div>

                {/* MOBILE REGISTRATION TOGGLE BUTTON */}
                <div className="lg:hidden">
                    <button 
                        onClick={() => setIsMobileFormOpen(!isMobileFormOpen)}
                        className="w-full py-4 bg-slate-900 hover:bg-purple-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                    >
                        {isMobileFormOpen ? 'Close Registration Form' : '+ Register New Gem'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* REGISTRATION FORM (Hidden on mobile unless toggled open) */}
                    <div className={`lg:col-span-4 xl:col-span-3 ${isMobileFormOpen || isEditing ? 'block' : 'hidden lg:block'}`}>
                        <div className={`p-5 rounded-2xl shadow-sm border transition-all sticky top-24 max-h-[85vh] overflow-y-auto ${isEditing ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500' : 'bg-white border-slate-200'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">{isEditing ? 'Update Profile' : 'Gem Registration'}</h2>
                                {isEditing ? (<button type="button" onClick={cancelEdit} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Cancel</button>) : null}
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <datalist id="gem-varieties">{GEM_DATA.varieties.map(v => <option key={v} value={v} />)}</datalist>
                                <datalist id="gem-cuts">{GEM_DATA.cuts.map(v => <option key={v} value={v} />)}</datalist>
                                <datalist id="gem-colors">{GEM_DATA.colors.map(v => <option key={v} value={v} />)}</datalist>
                                <datalist id="gem-clarity">{GEM_DATA.clarity.map(v => <option key={v} value={v} />)}</datalist>
                                <datalist id="gem-treatments">{GEM_DATA.treatments.map(v => <option key={v} value={v} />)}</datalist>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <hr className="flex-grow border-slate-200" />
                                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">General</span>
                                        <hr className="flex-grow border-slate-200" />
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

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2">
                                        <hr className="flex-grow border-slate-200" />
                                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Gemological</span>
                                        <hr className="flex-grow border-slate-200" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Origin</label>
                                            <input className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="e.g. Mogok" value={newGem.origin} onChange={e => setNewGem({...newGem, origin: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Treatment</label>
                                            <input list="gem-treatments" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="Select..." value={newGem.treatment} onChange={e => setNewGem({...newGem, treatment: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                           <label className="text-[10px] font-bold text-slate-400 uppercase">Clarity</label>
                                            <input list="gem-clarity" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="Select..." value={newGem.clarity} onChange={e => setNewGem({...newGem, clarity: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Cert #</label>
                                            <input className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="GIA/GRS..." value={newGem.certificate} onChange={e => setNewGem({...newGem, certificate: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2">
                                        <hr className="flex-grow border-slate-200" />
                                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Operational</span>
                                        <hr className="flex-grow border-slate-200" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Vendor</label>
                                            <input className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="Dealer name..." value={newGem.vendor} onChange={e => setNewGem({...newGem, vendor: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Date Acquired</label>
                                            <input type="date" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent text-slate-600" value={newGem.purchaseDate} onChange={e => setNewGem({...newGem, purchaseDate: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Storage Box</label>
                                        <input className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-transparent" placeholder="Location" value={newGem.location} onChange={e => setNewGem({...newGem, location: e.target.value})} />
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
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Retail Val $</label>
                                            <input type="number" step="0.01" className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm bg-white font-bold text-emerald-700" placeholder="0.00" value={newGem.price} onChange={e => setNewGem({...newGem, price: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">Calc $/ct: ${formPpc}</span>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-2">
                                    <div className="relative group w-32 h-32">
                                        <div className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${newGem.image ? 'border-emerald-200' : 'border-slate-300 hover:border-emerald-400 bg-white'}`}>
                                            {newGem.image ? (
                                                <img src={newGem.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <IconCamera className="text-slate-300 w-10 h-10" />
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        {newGem.image ? (
                                            <button type="button" onClick={() => setNewGem(p => ({...p, image: ''}))} className="absolute -top-2 -right-2 p-1 bg-white border border-slate-200 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-colors"><IconTrash /></button>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Private Notes</label>
                                    <textarea className="w-full p-2 border border-slate-200 rounded-md outline-none focus:border-emerald-500 text-sm h-16 bg-white" placeholder="Specific inclusions, client notes..." value={newGem.notes} onChange={e => setNewGem({...newGem, notes: e.target.value})} />
                                </div>

                                <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] text-white ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-900 hover:bg-purple-700 shadow-slate-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] border border-transparent hover:border-purple-500/50'}`}>
                                    {isEditing ? 'Update Profile' : 'Save Registration'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-8 lg:col-span-9 xl:col-span-9">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[900px]">
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
                                            Sparkle Tokens{renderSortIcon('price')}
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
                                            String(i.cut||'').toLowerCase().includes(search) || 
                                            String(i.sheetNum||'').toLowerCase().includes(search)
                                        );
                                    }).sort((a, b) => {
                                        let aVal = a[sortConfig.key] || 0;
                                        let bVal = b[sortConfig.key] || 0;
                                        if (['weight', 'price', 'sheetNum'].includes(sortConfig.key)) {
                                            aVal = safeNumber(aVal); bVal = safeNumber(bVal);
                                        } else {
                                            aVal = String(aVal).toLowerCase(); bVal = String(bVal).toLowerCase();
                                        }
                                        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                                        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                                        return 0;
                                    }).map(gem => {
                                        const ppcRow = safeNumber(gem.weight) > 0 ? formatCurrency(safeNumber(gem.price) / safeNumber(gem.weight)) : '0.00';
                                        return (
                                        <tr key={gem.id} className={`transition-colors ${editId === gem.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                                            <td className="p-4 align-top">
                                                <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-sm">{gem.sheetNum || '-'}</div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex gap-4">
                                                    <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
                                                        {gem.image ? (
                                                            <img src={gem.image} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <IconCamera className="w-5 h-5"/>
                                                            </div>
                                                        )}
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
                                                    {gem.dimL && gem.dimW ? (<span className="ml-2 text-slate-400">{gem.dimL}x{gem.dimW}{gem.dimD ? `x${gem.dimD}` : ''}mm</span>) : null}
                                                </div>
                                                <div className="text-[10px] text-slate-400 grid grid-cols-2 gap-x-2 gap-y-1">
                                                    <div><span className="font-bold uppercase">Org:</span> {gem.origin || '-'}</div>
                                                    <div><span className="font-bold uppercase">Trt:</span> {gem.treatment || '-'}</div>
                                                    <div><span className="font-bold uppercase">Clr:</span> {gem.clarity || '-'}</div>
                                                    <div><span className="font-bold uppercase">Crt:</span> {gem.certificate || '-'}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="text-emerald-700 font-black text-lg">${formatCurrency(gem.price)}</div>
                                                <div className="text-[11px] text-slate-500 font-medium mt-1">Cost: ${formatCurrency(gem.cost)}</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-tighter mt-2 border-t border-slate-100 pt-1">Rate: ${ppcRow}/ct</div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="mb-2"><span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold uppercase tracking-wider">{gem.location || 'Vault'}</span></div>
                                                <div className="text-[10px] text-slate-500"><div className="truncate w-24" title={gem.vendor}>Vnd: {gem.vendor || '-'}</div><div>Dt: {gem.purchaseDate || '-'}</div></div>
                                            </td>
                                            <td className="p-4 text-right align-top">
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex gap-1">
                                                        <button title="Open Digital Folder" onClick={() => openGemDetails(gem)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"><IconFolder /></button>
                                                        <button title="Edit Gem" onClick={() => startEdit(gem)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"><IconEdit /></button>
                                                        <button title="Print Label" onClick={() => {setSelectedGem(gem); setView('label')}} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><IconLabel /></button>
                                                    </div>
                                                    <button title="Delete" onClick={() => deleteGem(gem.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><IconTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                    {inventory.length === 0 ? (
                                        <tr><td colSpan="6" className="p-20 text-center text-slate-400 italic font-medium">No stones found. Awaiting initial registration.</td></tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-emerald-50 font-sans">
            <nav className="bg-slate-900 text-white p-4 px-8 flex justify-between items-center sticky top-0 z-50 no-print shadow-xl">
                <div className="flex items-center gap-4 group cursor-default">
                    {/* NAV BAR HARD LOCKED (box-shadow depth) */}
                    <div className="p-1.5 rounded-xl text-emerald-400 bg-emerald-500/10 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.6)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.9)] transition-all duration-500 relative group-hover:text-purple-500 group-hover:border-purple-500/60">
                        <IconPlatypus className="w-10 h-10 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-2xl italic tracking-tighter uppercase leading-none">
                            PLATYPUS GEMS
                        </span>
                        <span className="text-[9px] font-bold text-emerald-500 tracking-[0.3em] uppercase opacity-70 transition-colors duration-500 group-hover:text-purple-400">
                            Privé Inventory Vault
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vault Sync State</p>
                        <p className="text-xs font-mono text-emerald-400 uppercase tracking-tighter">Ready • {lastUpdated}</p>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-bold border border-emerald-500/20 tracking-widest uppercase flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>Secure Mode
                    </div>
                    <button onClick={handleLogOut} className="flex items-center gap-2 text-[10px] font-bold text-slate-300 hover:text-white uppercase tracking-widest transition-colors border-l border-slate-700 pl-6 ml-2">
                        <IconLogOut /> Exit Vault
                    </button>
                </div>
            </nav>
            
            {view === 'list' ? renderInventory() : null}
            {view === 'label' ? renderLabel() : null}
            {view === 'details' ? renderGemDetails() : null}

            <footer className="p-8 text-center text-slate-300 text-[10px] uppercase tracking-[0.2em] no-print">
                &copy; Platypus Gems • Cloud Vault Encryption • Automated Database Sync
            </footer>
        </div>
    );
}
