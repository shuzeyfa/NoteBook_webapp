'use client';

import { useState } from 'react';
import { Plus, Trash2, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  user: { name: string; email: string } | null;
}

export default function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  user,
}: SidebarProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-screen bg-secondary/30 border-r border-secondary flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-secondary">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-primary">Notebook</h1>
        </div>
        <button
          onClick={onCreateNote}
          className="w-full bg-primary text-black font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Note
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {notes.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onMouseEnter={() => setHoveredId(note.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group"
            >
              <button
                onClick={() => onSelectNote(note.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedNoteId === note.id
                    ? 'bg-primary/20 border border-primary/50'
                    : 'hover:bg-secondary/50'
                }`}
              >
                <h3 className="font-medium text-sm truncate">{note.title || 'Untitled'}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {note.content || 'No content'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(note.updatedAt)}</p>
              </button>

              {/* Delete Button */}
              {hoveredId === note.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this note?')) {
                      onDeleteNote(note.id);
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* User Menu */}
      <div className="border-t border-secondary p-4">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-black" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
          </div>
        </button>

        {showUserMenu && (
          <div className="mt-2 p-2 bg-secondary/50 rounded-lg border border-secondary">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-secondary rounded transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
