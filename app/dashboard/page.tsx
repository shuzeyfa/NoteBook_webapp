"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Save, Trash2, Send, RefreshCw } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_BASE = "https://notebook-backend-2-nl4v.onrender.com";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [askInput, setAskInput] = useState("");
  const [isSavingLoad, setSavingLoad] = useState<true | false>(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // ===================== AUTH CHECK =====================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchNotes();
  }, [router]);


  useEffect(() => {
    if (selectedNote) {
      setMessages([]);        // Clear previous chat when changing note
      setAiResponse("");      // Remove if you still have this old state
    }
  }, [selectedNote?.id]);

  // ===================== FETCH NOTES =====================
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/signin");
        return;
      }

      const data = await res.json();
      const notesArray = Array.isArray(data) ? data : [];
      setNotes(notesArray);

      if (notesArray.length > 0 && !selectedNote) setSelectedNote(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ===================== CREATE NOTE =====================
  const createNewNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
      });

      if (!res.ok) throw new Error();
      const newNote: Note = await res.json();

      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      setAiResponse("");
      setHasUnsavedChanges(false);
    } catch (err) {
      alert("Failed to create note");
    }
  };

  // ===================== MANUAL SAVE =====================
  const saveNote = async () => {
    if (!selectedNote) return;

    try {
      
        setSavingLoad(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: selectedNote.title,
          content: selectedNote.content,
        }),
      });

      if (res.ok) {
        setHasUnsavedChanges(false);

        await fetchNotes();
        // Update timestamp in list
        setNotes((prev) =>
          prev.map((n) =>
            n.id === selectedNote.id
              ? { ...selectedNote, updatedAt: new Date().toISOString() }
              : n
          )
        );

        alert("Note saved sucessfully")
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }finally {
        setSavingLoad(false);
    }
  };

  // ===================== DELETE NOTE =====================
  const deleteNote = async (id: string) => {
    if (!confirm("Delete this note permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(notes[0] || null);
      setHasUnsavedChanges(false);
    } catch (err) {
      alert("Could not delete note");
    }
  };

  // ===================== AI =====================
  const callAI = async (message: string) => {
    if (!selectedNote || !message.trim()) return;

    // Add user message immediately
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
    };
    setMessages((prev) => [...prev, userMsg]);

    setAskInput("");
    setIsAiLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/notes/${selectedNote.id}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.response,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: "Sorry, I couldn't get a response right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // ===================== RICH TEXT FORMAT =====================
  const formatText = (command: string, value?: string) => {
    if (editorRef.current) {
      document.execCommand(command, false, value || undefined);
      editorRef.current.focus();
    }
  };

  // ===================== EDITOR HANDLERS =====================
  const handleEditorInput = () => {
    if (!selectedNote || !editorRef.current) return;
    selectedNote.content = editorRef.current.innerHTML;
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedNote) return;
    selectedNote.title = e.target.value;
    setHasUnsavedChanges(true);
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNote.id ? { ...selectedNote } : n))
    );
  };

  // Sync editor when note changes
  useEffect(() => {
    if (selectedNote && editorRef.current) {
      editorRef.current.innerHTML = selectedNote.content || "";
      setHasUnsavedChanges(false);
    }
  }, [selectedNote]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin w-10 h-10 text-primaryColor mb-4" />
          <p className="text-foreground">Loading your notebook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#111111]">
      {/* LEFT SIDEBAR - unchanged */}
      <div className="hidden md:flex w-72 flex-col border-r border-white/10 bg-secondaryColor/40">
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 bg-primaryColor rounded-2xl flex items-center justify-center text-black">
            <BookOpen size={22} />
          </div>
          <span className="text-2xl font-semibold">NoteBook</span>
        </div>

        <div className="px-6 pt-6">
          <button
            onClick={createNewNote}
            className="w-full bg-primaryColor text-black font-medium py-3 px-4 rounded-tl-3xl rounded-br-3xl hover:rounded-tr-3xl hover:rounded-bl-3xl flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={18} />
            New Note
          </button>
        </div>

        <div className="px-6 pt-8 flex-1 overflow-auto">
          <div className="text-xs font-medium text-gray-400 mb-4">ALL NOTES ({notes.length})</div>

          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`w-full mb-3 px-4 py-3 rounded-tl-md rounded-br-md hover:rounded-tr-md hover:rounded-bl-md cursor-pointer transition-all border ${
                selectedNote?.id === note.id
                  ? "bg-primaryColor/10 border-primaryColor/40"
                  : "hover:bg-white/5 border-transparent"
              }`}
            >
              <div className="font-medium text-white line-clamp-1">{note.title || "Untitled"}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>

        <div
          onClick={() => router.push("/")}
          className="p-4 text-xs text-gray-400 border-t border-white/10 flex items-center justify-between hover:text-white hover:cursor-pointer"
        >
          ← Back to Home
        </div>
      </div>

      {/* MAIN EDITOR */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - with Manual Save */}
        <div className="h-14 border-b border-white/10 bg-[#1A1A1A] flex items-center px-6 gap-4">
          <button onClick={() => formatText("bold")} className="px-3 py-1 hover:bg-white/10 rounded-xl font-bold">B</button>
          <button onClick={() => formatText("italic")} className="px-3 py-1 hover:bg-white/10 rounded-xl italic">I</button>
          <button onClick={() => formatText("formatBlock", "h1")} className="px-3 py-1 hover:bg-white/10 rounded-xl text-sm">H1</button>
          <button onClick={() => formatText("formatBlock", "h2")} className="px-3 py-1 hover:bg-white/10 rounded-xl text-sm">H2</button>

          <div className="flex-1" />

          {/* Manual Save Section */}
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="text-amber-400 text-sm font-medium">Unsaved changes</span>
            )}
            {!hasUnsavedChanges && selectedNote && (
              <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                <span className="text-lg">✓</span> Saved
              </span>
            )}

            {/* if we are saving note or updating */}
            {isSavingLoad && <button
                className="flex items-center gap-2 bg-white/20 opacity-50 cursor-not-allowed px-5 py-1.5 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl text-white font-medium transition-all"
                >
                <span>Saving</span>
                </button>
            }

            {/* if we are not saving any thing  */}
            {!isSavingLoad && <button
              onClick={saveNote}
              disabled={!hasUnsavedChanges}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-1.5 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl text-white font-medium transition-all"
            >
              <Save size={18} />
              <span>Save</span>
            </button>
            }

            {selectedNote && (
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="flex items-center justify-center w-9 h-9 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-8 overflow-auto bg-[#111111]">
          {selectedNote ? (
            <div className="max-w-3xl mx-auto">
              <input
                ref={titleRef}
                value={selectedNote.title}
                onChange={handleTitleChange}
                className="w-full bg-transparent text-4xl font-semibold outline-none mb-8 text-white"
                placeholder="Note title..."
              />

              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                className="min-h-[70vh] text-lg leading-relaxed text-white focus:outline-none"
                style={{ lineHeight: 1.8 }}
              />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center text-center">
              <h1 className="text-5xl font-bold mb-6">Welcome to NoteBook</h1>
              <p className="text-xl text-gray-400 mb-8">Start writing your thoughts here...</p>
              <div className="max-w-md space-y-6 text-gray-400">
                <p>You can use the AI assistant on the right to help you understand, summarize, or explain your notes.</p>
                <p>This is a simple, clean space for your ideas. No distractions, just you and your thoughts.</p>
              </div>
              <button
                onClick={createNewNote}
                className="mt-12 bg-primaryColor text-black px-8 py-3 rounded-tl-3xl rounded-br-3xl hover:rounded-tr-3xl hover:rounded-bl-3xl text-lg font-medium"
              >
                Create your first note
              </button>
            </div>
          )}
        </div>
      </div>

      
      {/* ==================== RIGHT AI SIDEBAR ==================== */}
      <div className="w-[20%] border-l border-white/10 bg-[#1A1A1A] flex flex-col">
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 bg-primaryColor rounded-2xl flex items-center justify-center text-black">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="font-semibold">AI Assistant</div>
            <div className="text-xs text-gray-400">Powered by Groq</div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.length === 0 ? (
            /* ==================== WELCOME TEXT (when no chat) ==================== */
            <div className="text-gray-400 text-center mt-10">
              Hi! I&apos;m your AI assistant.<br /><br />
              I can help you understand, summarize, or expand your notes.<br /><br />
              Try the quick actions below or ask me anything!
            </div>
          ) : (
            /* ==================== CHAT MESSAGES ==================== */
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-3xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primaryColor text-black rounded-tr-none'
                      : 'bg-white/10 text-white rounded-tl-none'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isAiLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-5 py-3 rounded-3xl rounded-tl-none flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-gray-400">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions & Input */}
        <div className="p-6 border-t border-white/10">
          <div className="text-xs text-gray-400 mb-3">QUICK ACTIONS</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => callAI("Explain the current note in clear, simple terms.")}
              className="h-10 bg-white/5 hover:bg-white/10 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl text-sm font-medium"
            >
              Explain
            </button>
            <button
              onClick={() => callAI("Summarize the current note concisely.")}
              className="h-10 bg-white/5 hover:bg-white/10 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl text-sm font-medium"
            >
              Summarize
            </button>
          </div>

          <div className="mt-6 flex gap-2">
            <input
              type="text"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && askInput.trim()) {
                  callAI(askInput);
                  setAskInput("");
                }
              }}
              placeholder="Ask anything about the note..."
              className="flex-1 bg-white/5 border border-white/10 rounded-tl-md rounded-br-md hover:rounded-tr-md hover:rounded-bl-md px-4 py-3 outline-none focus:bg-white/10"
            />
            <button
              onClick={() => {
                if (askInput.trim()) {
                  callAI(askInput);
                  setAskInput("");
                }
              }}
              className="bg-primaryColor text-black px-6 rounded-tl-md rounded-br-md hover:rounded-tr-md hover:rounded-bl-md flex items-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}