import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButton() {
  const [user, setUser] = React.useState(auth.currentUser);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-white bg-secondary-600 rounded-lg hover:bg-secondary-700 transition duration-300"
        >
          <LogOut className="h-5 w-5" />
          Sohoka
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          className="flex items-center gap-2 px-4 py-2 text-white bg-secondary-600 rounded-lg hover:bg-secondary-700 transition duration-300"
        >
          <LogIn className="h-5 w-5" />
          Injira na Google
        </button>
      )}
    </div>
  );
}