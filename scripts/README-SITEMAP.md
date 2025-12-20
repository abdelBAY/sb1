# Dynamic Sitemap Generation

This script generates a dynamic sitemap.xml file that includes:
- Static pages (homepage, about, contact, etc.)
- Dynamic product pages from the database
- Dynamic donor profile pages from the database

## Setup

1. Make sure you have the Supabase environment variables set:
   ```bash
   export SUPABASE_URL="your-supabase-url"
   export SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

   Or create a `.env` file with:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Usage

Run the script manually:
```bash
npm run generate:sitemap
```

Or directly:
```bash
node scripts/generate-sitemap.js
```

## Automated Generation

### Option 1: Cron Job (Linux/Mac)

Add to your crontab to run daily:
```bash
0 2 * * * cd /path/to/project && npm run generate:sitemap
```

### Option 2: GitHub Actions

Create `.github/workflows/sitemap.yml`:
```yaml
name: Generate Sitemap

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM UTC
  workflow_dispatch: # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run generate:sitemap
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'Update sitemap.xml'
          file_pattern: 'public/sitemap.xml'
```

### Option 3: Netlify Build Hook

Add to your build command:
```bash
npm run generate:sitemap && npm run build
```

## Output

The script generates `public/sitemap.xml` with:
- All static pages
- All active product pages (up to 10,000)
- All donor profile pages (up to 10,000)

## Notes

- The script limits to 10,000 products and 10,000 donors to keep the sitemap manageable
- Only products with status != 'GIVEN_AWAY' are included
- Last modified dates are based on `updated_at` or `created_at` fields
- The sitemap is regenerated each time the script runs

## Troubleshooting

If you get errors:
1. Check that Supabase credentials are set correctly
2. Verify database tables exist: `announcements` and `profiles`
3. Check file permissions for writing to `public/sitemap.xml`

