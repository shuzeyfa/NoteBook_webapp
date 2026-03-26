"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "https://notebook-backend-2-nl4v.onrender.com";
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    loadNotes();
  }, [router]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`${API_BASE}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/signin");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load notes");
      }

      const data = await res.json();

      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createFirstNote = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify({
          title: "Your First Note",
          content: "",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create note");
      }

      const created: Note = await res.json();
      setNotes([created]);
    } catch (err) {
      console.error(err);
      setError("Failed to create note");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primaryColor/30 border-t-primaryColor rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6">
      {/* Error */}
      {error && (
        <div className="bg-red-300 text-red-700 border border-red-600 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Empty state */}
      {notes.length === 0 && !error && (
        <div className="text-center mt-20">
          <p className="mb-4 text-lg">No notes yet</p>
          <button
            onClick={createFirstNote}
            className="bg-primaryColor text-white px-4 py-2 rounded hover:opacity-90"
          >
            Create your first note
          </button>
        </div>
      )}

      {/* Notes list */}
      {notes.length > 0 && (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-300 rounded p-4 shadow-sm bg-white"
            >
              <h2 className="font-semibold text-lg text-black mb-2">{note.title}</h2>
              <p className="text-gray-700 mb-2">
                {note.content || "No content"}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}