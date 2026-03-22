'use client';

import { useState } from 'react';
import { Plus, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileNavProps {
  user: { name: string; email: string } | null;
  onCreateNote: () => void;
  notesCount: number;
}

export default function MobileNav({ user, onCreateNote, notesCount }: MobileNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  return (
    <nav className="md:hidden sticky top-0 z-20 bg-background border-b border-secondary">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-bold text-lg text-primary">Notebook</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateNote}
            className="p-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-secondary bg-secondary/10 p-4 space-y-4">
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
            <p className="text-xs text-gray-500 mt-2">{notesCount} notes</p>
          </div>
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2 px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
