import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Dashboard from './Dashboard';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check if we are already logged in when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-emerald-500/30">
      
      {/* Top Logo Area */}
      <div className="absolute top-8 left-8">
        <h1 className="text-xl font-black italic tracking-widest text-emerald-500 uppercase leading-none">
          Platypus<br/><span className="text-white">Gems</span>
        </h1>
      </div>

      {/* Logic: If no session, show Login. If session exists, show Dashboard */}
      {!session ? (
        <Auth />
      ) : (
        <div className="w-full flex flex-col items-center w-full max-w-6xl mt-8">
          <div className="w-full flex justify-between items-center mb-4">
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Vault Unlocked</span>
            </div>
            
            <button 
              onClick={() => supabase.auth.signOut()} 
              className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-red-400 transition-colors"
            >
              [ Lock Vault ]
            </button>
          </div>

          {/* This injects the new Dashboard component right here */}
          <Dashboard /> 
        </div>
      )}

    </div>
  );
}

export default App;