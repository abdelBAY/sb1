# Apply Delete Policy Migration to Supabase

## The Error You're Seeing:
```
GET http://localhost:5173/ net::ERR_CONNECTION_REFUSED
```
This is a harmless warning from Supabase's real-time client. It doesn't affect the delete functionality.

## To Fix the Delete Feature:

### Option 1: Apply Migration via SQL Editor (RECOMMENDED)

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/wkvwgbqwgowlwodgdpus
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- Add delete policy for messages
-- Users can delete their own messages (sent or received)

CREATE POLICY "Users can delete their own messages"
  ON messages FOR DELETE
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );
```

5. Click **Run** or press Ctrl+Enter
6. You should see: "Success. No rows returned"

### Option 2: Apply via Supabase CLI

```bash
cd g:\Projects-Bolt-ai\Donations-Project-Solab\sb1
npx supabase link --project-ref wkvwgbqwgowlwodgdpus
npx supabase db push
```

## Test the Delete Feature:

1. Refresh your browser at http://localhost:5174/
2. Go to Messages page
3. Select a conversation
4. Click the red trash icon 🗑️
5. Confirm deletion
6. Check the browser console for: "Conversation deleted successfully"

## What Changed in the Code:

### Before (Problem):
- Deleted ALL messages between two users regardless of conversation
- No filtering by announcement_id

### After (Fixed):
- ✅ Filters by announcement_id to delete only the specific conversation
- ✅ Only deletes messages for the current user (sender or receiver)
- ✅ Proper error handling with detailed messages
- ✅ Console logs for debugging

## Expected Behavior:

After clicking delete:
1. Confirmation dialog appears
2. Messages are deleted from Supabase database
3. Conversation disappears from your chat list
4. Console shows: "Conversation deleted successfully"
5. Chat list refreshes automatically

## Troubleshooting:

### Delete button doesn't work:
- Check browser console for errors
- Make sure you're logged in
- Verify migration was applied

### Permission denied error:
- Run the SQL in Supabase SQL Editor
- Wait 10 seconds and try again

### Messages not deleted:
- Check Supabase dashboard → Table Editor → messages
- Look for any messages still there
- Check console for specific error messages

## Success Indicators:
✅ No errors in console
✅ Conversation disappears immediately
✅ Chat list updates
✅ "Conversation deleted successfully" in console

