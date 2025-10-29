# Fix Unread Messages Issue

## The Problem
After refreshing, unread counts come back because the database wasn't updated.

## The Solution

### Step 1: Apply the SQL Migration

Go to your Supabase dashboard and run this SQL:

**SQL to Run:**
```sql
-- Fix the UPDATE policy for messages to avoid OLD reference in USING clause
DROP POLICY IF EXISTS "Users can update message read status" ON messages;

CREATE POLICY "Users can update message read status"
  ON messages FOR UPDATE
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  )
  WITH CHECK (
    auth.uid() = sender_id OR 
    (auth.uid() = receiver_id AND read = true)
  );
```

### Step 2: How to Apply

1. Open your browser and go to: https://supabase.com/dashboard/project/wkvwgbqwgowlwodgdpus/sql
2. Click "New Query" or open the SQL Editor
3. Copy and paste the SQL above
4. Click "Run" or press Ctrl+Enter
5. You should see: "Success. No rows returned"

### Step 3: Test

1. Refresh your app
2. Open the messages page
3. Open any chat with unread messages
4. Check that the unread badge disappears
5. Refresh the page
6. The unread badge should stay at 0 (not come back!)

## What This Fixes

✅ Unread badges disappear when you open a chat  
✅ Badges stay gone after refresh  
✅ No more database errors  
✅ Read status persists in the database  

## Alternative: Quick Test (No SQL needed)

If you want to test without SQL first:
- The UI will update immediately
- But after refresh, counts will return to the previous state
- This lets you verify the UI works before fixing the database

