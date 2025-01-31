import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButton() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.role === 'admin') {
        navigate('/admin');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.role === 'admin') {
        navigate('/admin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleSignOut}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 text-white bg-secondary-600 rounded-lg transition duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary-700'
          }`}
        >
          <LogOut className="h-5 w-5" />
          {loading ? 'Tegereza...' : 'Sohoka'}
        </button>
      ) : (
        <button
          onClick={() => navigate('/auth')}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 text-white bg-secondary-600 rounded-lg transition duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary-700'
          }`}
        >
          <LogIn className="h-5 w-5" />
          {loading ? 'Tegereza...' : 'Injira'}
        </button>
      )}
    </div>
  );
}