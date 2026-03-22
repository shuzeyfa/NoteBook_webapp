'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bold, Italic, Heading2, Heading3, Menu } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface EditorProps {
  note: Note;
  onSave: (note: Note) => void;
}

export default function Editor({ note, onSave }: EditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaved, setIsSaved] = useState(true);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    setIsSaved(false);

    const timer = setTimeout(() => {
      const updatedNote: Note = {
        ...note,
        title: title || 'Untitled',
        content,
        updatedAt: new Date().toISOString(),
      };
      onSave(updatedNote);
      setIsSaved(true);
    }, 1500); // Auto-save after 1.5 seconds of inactivity

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [title, content]);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.getElementById('editor-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newContent);

    // Move cursor after the inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + before.length + selectedText.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="h-screen bg-background border-r border-secondary flex flex-col">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-secondary p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="flex-1 bg-transparent text-2xl font-bold outline-none"
          />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {!isSaved && <span className="animate-pulse">Saving...</span>}
            {isSaved && <span>Auto-saved</span>}
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg w-full overflow-x-auto">
          <button
            onClick={() => insertFormatting('**', '**')}
            title="Bold"
            className="p-2 hover:bg-primary/20 rounded transition-colors text-primary flex-shrink-0"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => insertFormatting('*', '*')}
            title="Italic"
            className="p-2 hover:bg-primary/20 rounded transition-colors text-primary flex-shrink-0"
          >
            <Italic size={18} />
          </button>
          <div className="w-px h-6 bg-secondary" />
          <button
            onClick={() => insertFormatting('## ', '\n')}
            title="Heading 2"
            className="p-2 hover:bg-primary/20 rounded transition-colors text-primary flex-shrink-0"
          >
            <Heading2 size={18} />
          </button>
          <button
            onClick={() => insertFormatting('### ', '\n')}
            title="Heading 3"
            className="p-2 hover:bg-primary/20 rounded transition-colors text-primary flex-shrink-0"
          >
            <Heading3 size={18} />
          </button>
          <div className="w-px h-6 bg-secondary" />
          <button
            onClick={() => insertFormatting('- ')}
            title="Bullet List"
            className="p-2 hover:bg-primary/20 rounded transition-colors text-primary flex-shrink-0"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 overflow-hidden p-4 md:p-8">
        <textarea
          id="editor-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts here..."
          className="w-full h-full bg-transparent text-base leading-relaxed outline-none resize-none"
        />
      </div>

      {/* Footer Info */}
      <div className="border-t border-secondary bg-secondary/10 px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-400">
        <div>
          {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
        </div>
        <div>
          Created {new Date(note.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
