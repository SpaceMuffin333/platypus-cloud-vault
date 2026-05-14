import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import GemDetails from './GemDetails';

export default function Dashboard() {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGem, setSelectedGem] = useState(null);

  useEffect(() => {
    fetchGems();
  }, []);

  async function fetchGems() {
    // This tells the bridge to go to the 'gems' table and grab everything
    const { data, error } = await supabase
      .from('gems')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching gems:", error);
    } else {
      setGems(data);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="text-emerald-500 font-bold tracking-widest uppercase text-sm animate-pulse">Syncing Cloud Data...</div>;
  }

  // If a gem is selected, show its detailed dossier instead of the grid
  if (selectedGem) {
    return <GemDetails gem={selectedGem} onBack={() => setSelectedGem(null)} />;
  }

  // Otherwise, show the normal grid
  return (
    <div className="w-full max-w-6xl mt-8">
      <div className="flex justify-between items-end mb-6 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Active Inventory</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{gems.length} Stones Secured</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-widest transition-colors">
          + Add Gem
        </button>
      </div>

      {gems.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest">The vault is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gems.map((gem) => (
            <div key={gem.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-emerald-500/50 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-slate-900 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-emerald-500/20">
                  {gem.vault_id}
                </span>
                <span className="text-slate-400 text-xs font-bold">{gem.weight_ct} ct</span>
              </div>
              <h3 className="text-lg font-black text-white capitalize">{gem.color} {gem.variety}</h3>
              <p className="text-slate-400 text-sm capitalize">{gem.cut} • {gem.clarity}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Value</p>
                  <p className="text-emerald-400 font-bold">${gem.market_value?.toLocaleString() || '0'}</p>
                </div>
                <button 
                  onClick={() => setSelectedGem(gem)}
                  className="text-xs font-bold text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}