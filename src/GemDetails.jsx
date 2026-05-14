import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function GemDetails({ gem, onBack }) {
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [gem.id]);

  async function fetchAssets() {
    const { data, error } = await supabase
      .from('gem_assets')
      .select('*')
      .eq('gem_id', gem.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) setAssets(data);
  }

  async function handleFileUpload(event) {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${gem.vault_id}_${Date.now()}.${fileExt}`;
      const filePath = `${gem.id}/${fileName}`;

      // 1. Upload the physical file to the secure cloud bucket
      const { error: uploadError } = await supabase.storage
        .from('vault-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL so we can display it
      const { data: { publicUrl } } = supabase.storage
        .from('vault-assets')
        .getPublicUrl(filePath);

      // 3. Create a record in the database linking the file to this specific gem
      const { error: dbError } = await supabase.from('gem_assets').insert({
        gem_id: gem.id,
        file_url: publicUrl,
        file_name: file.name,
        asset_type: file.type.includes('image') ? 'macro_photo' : 'valuation_document'
      });

      if (dbError) throw dbError;

      // Refresh the gallery to show the new file
      fetchAssets();
    } catch (error) {
      console.error('Upload failed:', error.message);
      alert('Upload failed. Check console for details.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mt-4 bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl">
      <button 
        onClick={onBack}
        className="text-emerald-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mb-6 flex items-center gap-2"
      >
        ← Back to Vault Grid
      </button>

      <div className="border-b border-slate-700 pb-6 mb-6">
        <h2 className="text-3xl font-black text-white capitalize">{gem.color} {gem.variety}</h2>
        <div className="flex gap-4 mt-2">
          <span className="bg-slate-900 text-emerald-400 text-xs font-bold px-3 py-1 rounded uppercase tracking-widest border border-emerald-500/20">
            {gem.vault_id}
          </span>
          <span className="text-slate-400 text-sm">{gem.weight_ct} ct • {gem.cut} • {gem.clarity}</span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Attached Assets & Valuations</h3>
          
          <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-4 py-2 rounded uppercase tracking-widest transition-colors shadow-lg shadow-emerald-900/50">
            {uploading ? 'Encrypting & Uploading...' : '+ Upload File'}
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={uploading}
              accept="image/*,application/pdf,video/*"
            />
          </label>
        </div>

        {assets.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-700 border-dashed rounded-xl p-8 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No files attached to this stone.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {assets.map((asset) => (
              <a 
                key={asset.id} 
                href={asset.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="block bg-slate-900 border border-slate-700 rounded-lg p-3 hover:border-emerald-500 transition-colors group"
              >
                {asset.asset_type === 'macro_photo' ? (
                  <img src={asset.file_url} alt="Macro" className="w-full h-24 object-cover rounded mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-24 bg-slate-800 rounded mb-2 flex items-center justify-center">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Document</span>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 truncate">{asset.file_name}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}