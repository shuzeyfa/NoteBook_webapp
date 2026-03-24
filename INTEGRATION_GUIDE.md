# Dashboard Integration Guide

## Overview
The dashboard is now fully integrated with your Golang backend at `https://notebook-backend-2-nl4v.onrender.com`. All API calls are centralized in `/lib/api.ts` for easy maintenance and debugging.

## Backend API Endpoints Used

### Notes Endpoints
- `GET /api/notes` - Fetch all notes for authenticated user
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### AI Endpoints
- `POST /api/ai/analyze` - Analyze note content with action (explain/summarize/expand)

### Auth Endpoints
- `POST /api/auth/logout` - Logout user

## API Service (`/lib/api.ts`)

### Features
1. **Automatic Token Management** - Retrieves JWT token from localStorage and includes in all requests
2. **Error Handling** - Catches 401 errors and redirects to signin
3. **Response Normalization** - Handles different response formats (direct data or wrapped in `data` field)
4. **MongoDB ID Support** - Converts MongoDB's `_id` to `id` for consistency
5. **Console Logging** - All API calls logged with `[API]` prefix for debugging

### Usage Example
```typescript
// Get all notes
const notes = await notesAPI.getAll();

// Create note
const newNote = await notesAPI.create({
  title: 'My Note',
  content: 'Note content',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Update note
const updated = await notesAPI.update(noteId, {
  title: 'Updated Title',
  content: 'Updated content',
});

// Delete note
await notesAPI.delete(noteId);

// AI Analysis
const result = await aiAPI.analyze(noteId, noteContent, 'summarize');

// Logout
await authAPI.logout();
```

## Component Integration

### Dashboard Page (`/app/dashboard/page.tsx`)
- Manages overall state (notes list, selected note, loading, errors)
- Handles authentication check on mount
- Coordinates all note CRUD operations
- Displays loading skeleton and error messages

### Sidebar Component (`/components/dashboard/Sidebar.tsx`)
- Displays list of notes
- Shows user profile and logout button
- Handles note selection and deletion
- Formats dates intelligently (Today, Yesterday, etc.)

### Editor Component (`/components/dashboard/Editor.tsx`)
- Rich text editor with formatting toolbar
- Auto-save after 1.5 seconds of inactivity
- Shows save status (Saving... / Auto-saved)
- Displays character and word counts

### AI Assistant Component (`/components/dashboard/AIAssistant.tsx`)
- Chat interface for AI interactions
- Quick action buttons (Explain, Summarize, Expand)
- Message history with copy-to-clipboard functionality
- Auto-scrolls to latest messages

### Mobile Navigation (`/components/dashboard/MobileNav.tsx`)
- Mobile-optimized header with menu
- User profile info in mobile menu
- Responsive logout button

## Authentication Flow

1. User logs in via `/signin` page
2. JWT token stored in `localStorage` as `token`
3. All API calls automatically include `Authorization: Bearer {token}` header
4. If token is invalid (401 response), user is redirected to `/signin`

## Debugging Tips

All API calls are logged with the `[API]` prefix:
```
[API] Fetching: https://notebook-backend-2-nl4v.onrender.com/api/notes Method: GET
[API] Notes fetched: [...]
[API] Note created: {...}
[API] Note deleted: abc123
```

Dashboard operations are logged with the `[Dashboard]` prefix:
```
[Dashboard] Loaded notes: [...]
[Dashboard] Note saved: {...}
[Dashboard] Error loading notes: Error message
```

Component operations are logged with component name prefix:
```
[Sidebar] Logout error: Error message
[AIAssistant] Error: Error message
[MobileNav] Logout error: Error message
```

## Troubleshooting

### Notes Not Loading
1. Check browser console for errors with `[API]` prefix
2. Verify JWT token is in `localStorage` (Application tab → Storage → Local Storage)
3. Ensure backend is running and accessible
4. Check network tab to see actual API response

### Notes Not Saving
1. Check console for `[API]` errors when saving
2. Verify backend endpoint structure matches API call
3. Check if note object has required fields (title, content, createdAt, updatedAt)

### AI Assistant Not Working
1. Ensure note has content before using quick actions
2. Check console for `[AIAssistant]` errors
3. Verify backend `/api/ai/analyze` endpoint is implemented

## Next Steps

1. **Implement Backend Endpoints** - Ensure your Golang backend has all listed endpoints
2. **Add Error Boundaries** - Wrap components in React error boundaries for better UX
3. **Add Loading States** - Show spinners during longer operations
4. **Implement Search** - Add note search in Sidebar
5. **Add Tags/Categories** - Organize notes with tags
6. **Implement Sharing** - Share notes with other users

## Environment Variables

Currently using hardcoded backend URL:
```
https://notebook-backend-2-nl4v.onrender.com
```

To make it configurable:
1. Create `.env.local` file in project root
2. Add: `NEXT_PUBLIC_API_URL=https://notebook-backend-2-nl4v.onrender.com`
3. Update `lib/api.ts`: Change `const API_BASE_URL = '...'` to `const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '...'`
