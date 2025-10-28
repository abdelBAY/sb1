# Apply Delete Policy to Your Supabase Database

## Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor
Copy this URL and open it in your browser:
```
https://supabase.com/dashboard/project/wkvwgbqwgowlwodgdpus/sql/new
```

### Step 2: Copy and Paste This SQL

```sql
-- Add delete policy for messages
CREATE POLICY IF NOT EXISTS "Users can delete their own messages"
  ON messages FOR DELETE
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );
```

### Step 3: Run the SQL
1. Click the **RUN** button (or press `Ctrl+Enter`)
2. Wait for the success message

### Step 4: Verify It Worked
You should see: `Success. No rows returned`

### Step 5: Test the Delete Feature
1. Go back to your app: http://localhost:5174/
2. Open Messages page
3. Select a conversation
4. Click the red 🗑️ trash icon
5. Confirm deletion
6. Check console - should see "Conversation deleted successfully"

## What This Does
- Allows users to delete messages where they are the sender OR receiver
- Uses Row Level Security (RLS) for security
- Prevents users from deleting other people's conversations
- Enables the delete button in your Messages page

