# PowerShell script to apply SQL to Supabase via REST API
# Make sure you have your Supabase credentials

$SUPABASE_URL = "https://wkvwgbqwgowlwodgdpus.supabase.co"
$SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdndnYnF3Z293bHdvZGdkcHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NjIyMjQsImV4cCI6MjA1NDMzODIyNH0.6s8noC3ZfnuMG25HzCTRvJPqgSNVs1yDggHKxWrXCMc"

$sql = @"
CREATE POLICY IF NOT EXISTS "Users can delete their own messages"
  ON messages FOR DELETE
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );
"@

Write-Host "Opening Supabase Dashboard..."
Write-Host "URL: https://supabase.com/dashboard/project/wkvwgbqwgowlwodgdpus/sql/new"
Write-Host ""
Write-Host "Manually copy and paste this SQL:"
Write-Host "----------------------------------"
Write-Host $sql
Write-Host "----------------------------------"
Write-Host ""
Write-Host "Then click RUN to apply the migration."

