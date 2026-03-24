'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Editor from '@/components/dashboard/Editor';
import AIAssistant from '@/components/dashboard/AIAssistant';
import MobileNav from '@/components/dashboard/MobileNav';
import { notesAPI, type Note } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }
      // Here you would decode the token to get user info
      // For now, we'll use placeholder data
      setCurrentUser({ name: 'User', email: 'user@example.com' });
      loadNotes();
    };

    checkAuth();
  }, [router]);

  // Load notes from backend
  const loadNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const notes = await notesAPI.getAll();
      console.log('[Dashboard] Loaded notes:', notes);
      setNotes(notes);
      
      // Select first note
      if (notes && notes.length > 0) {
        setSelectedNoteId(notes[0].id);
      }
    } catch (err) {
      console.error('[Dashboard] Error loading notes:', err);
      setError('Failed to load notes. Please try again.');
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const handleCreateNote = async () => {
    try {
      setError(null);
      const newNoteData = {
        title: 'New Note',
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const createdNote = await notesAPI.create(newNoteData);
      console.log('[Dashboard] Note created:', createdNote);

      setNotes([createdNote, ...notes]);
      setSelectedNoteId(createdNote.id);
    } catch (err) {
      console.error('[Dashboard] Error creating note:', err);
      setError('Failed to create note. Please try again.');
    }
  };

  const handleSaveNote = async (updatedNote: Note) => {
    try {
      setError(null);
      const savedNote = await notesAPI.update(updatedNote.id, {
        title: updatedNote.title,
        content: updatedNote.content,
        updatedAt: new Date().toISOString(),
      });

      console.log('[Dashboard] Note saved:', savedNote);
      setNotes(notes.map((note) => (note.id === updatedNote.id ? savedNote : note)));
    } catch (err) {
      console.error('[Dashboard] Error saving note:', err);
      setError('Failed to save note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setError(null);
      await notesAPI.delete(noteId);
      console.log('[Dashboard] Note deleted:', noteId);

      const newNotes = notes.filter((note) => note.id !== noteId);
      setNotes(newNotes);
      
      if (selectedNoteId === noteId) {
        setSelectedNoteId(newNotes.length > 0 ? newNotes[0].id : null);
      }
    } catch (err) {
      console.error('[Dashboard] Error deleting note:', err);
      setError('Failed to delete note. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Navigation */}
      <MobileNav 
        user={currentUser}
        onCreateNote={handleCreateNote}
        notesCount={notes.length}
      />

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 md:min-h-screen">
        {/* Sidebar */}
        <div className="md:col-span-3 lg:col-span-2 border-r border-secondary">
          <Sidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
            user={currentUser}
          />
        </div>

        {/* Editor */}
        <div className="md:col-span-6 lg:col-span-7 border-r border-secondary">
          {selectedNote ? (
            <Editor
              note={selectedNote}
              onSave={handleSaveNote}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Create your first note to get started</p>
            </div>
          )}
        </div>

        {/* AI Assistant */}
        <div className="md:col-span-3 lg:col-span-3">
          <AIAssistant
            note={selectedNote}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-[calc(100vh-60px)]">
        {selectedNote ? (
          <Editor
            note={selectedNote}
            onSave={handleSaveNote}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Create your first note to get started</p>
          </div>
        )}
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
