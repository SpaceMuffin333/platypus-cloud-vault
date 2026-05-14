import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    // This knocks on the Supabase door with your credentials
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black italic uppercase tracking-widest text-emerald-400">Vault Access</h2>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Authorized Personnel Only</p>
      </div>

      <form onSubmit={handleLogin} className="w-full space-y-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
        {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg text-center font-bold">{errorMsg}</div>}
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Identity</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passcode</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg uppercase tracking-widest text-xs transition-colors shadow-lg shadow-emerald-900/50 disabled:opacity-50"
        >
          {loading ? 'Decrypting...' : 'Disengage Locks'}
        </button>
      </form>
    </div>
  );
}