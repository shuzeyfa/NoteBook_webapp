const API_BASE_URL = 'https://notebook-backend-2-nl4v.onrender.com/api';

export interface Note {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Fetch with auth header
const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('[API] Fetching:', url, 'Method:', options.method || 'GET');

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle unauthorized
  if (response.status === 401) {
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }

  return response;
};

// Notes API
export const notesAPI = {
  // Get all notes
  async getAll(): Promise<Note[]> {
    try {
      const response = await fetchWithAuth('/notes');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const result = await response.json();
      console.log('[API] Notes fetched:', result);
      
      // Handle different response formats
      const notes = Array.isArray(result) ? result : result.data || [];
      
      // Normalize note IDs (MongoDB uses _id, but we want id)
      return notes.map((note: any) => ({
        ...note,
        id: note._id || note.id,
      }));
    } catch (error) {
      console.error('[API] Error fetching notes:', error);
      throw error;
    }
  },

  // Create new note
  async create(note: Omit<Note, '_id' | 'id'>): Promise<Note> {
    try {
      const response = await fetchWithAuth('/notes', {
        method: 'POST',
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create note');
      }

      const result = await response.json();
      console.log('[API] Note created:', result);
      
      const createdNote = result.data || result;
      return {
        ...createdNote,
        id: createdNote._id || createdNote.id,
      };
    } catch (error) {
      console.error('[API] Error creating note:', error);
      throw error;
    }
  },

  // Get single note
  async getById(id: string): Promise<Note> {
    try {
      const response = await fetchWithAuth(`/notes/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch note');
      }

      const result = await response.json();
      console.log('[API] Note fetched:', result);
      
      const note = result.data || result;
      return {
        ...note,
        id: note._id || note.id,
      };
    } catch (error) {
      console.error('[API] Error fetching note:', error);
      throw error;
    }
  },

  // Update note
  async update(id: string, note: Partial<Note>): Promise<Note> {
    try {
      const response = await fetchWithAuth(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update note');
      }

      const result = await response.json();
      console.log('[API] Note updated:', result);
      
      const updatedNote = result.data || result;
      return {
        ...updatedNote,
        id: updatedNote._id || updatedNote.id,
      };
    } catch (error) {
      console.error('[API] Error updating note:', error);
      throw error;
    }
  },

  // Delete note
  async delete(id: string): Promise<void> {
    try {
      const response = await fetchWithAuth(`/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete note');
      }

      console.log('[API] Note deleted:', id);
    } catch (error) {
      console.error('[API] Error deleting note:', error);
      throw error;
    }
  },
};

// AI API
export const aiAPI = {
  // Analyze note content
  async analyze(noteId: string, content: string, action: 'explain' | 'summarize' | 'expand'): Promise<string> {
    try {
      const response = await fetchWithAuth('/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({
          noteId,
          content,
          action,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze note');
      }

      const result = await response.json();
      console.log('[API] AI analysis:', result);
      
      return result.data?.result || result.result || '';
    } catch (error) {
      console.error('[API] Error analyzing note:', error);
      throw error;
    }
  },
};

// Auth API
export const authAPI = {
  async logout(): Promise<void> {
    try {
      const token = getToken();
      if (!token) return;

      await fetchWithAuth('/auth/logout', {
        method: 'POST',
      });

      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error('[API] Error logging out:', error);
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  },
};
