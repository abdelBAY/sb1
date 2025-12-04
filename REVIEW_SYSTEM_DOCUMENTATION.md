# Review System Documentation

## Overview
The review system allows users to rate and review donors after interacting with their items. The system includes reviews, ratings, notifications, and displays reviews on multiple pages.

## Database Structure

### 1. Reviews Table (`public.reviews`)
**Location**: `supabase/migrations/20251124123000_add_reviews_system.sql`

**Schema**:
- `id` (uuid, Primary Key) - Unique review identifier
- `reviewer_id` (uuid) - References `profiles(id)` and `auth.users(id)` - The user who wrote the review
- `reviewed_id` (uuid) - References `auth.users(id)` - The donor being reviewed
- `rating` (integer) - Rating from 1 to 5 stars (CHECK constraint)
- `comment` (text, nullable) - Optional text comment
- `created_at` (timestamptz) - When the review was created

**Indexes**:
- `reviews_reviewed_id_idx` - For quick lookups of reviews for a specific donor
- `reviews_reviewer_id_idx` - For quick lookups of reviews by a specific reviewer

**Row Level Security (RLS) Policies**:
- ✅ **SELECT**: Everyone can view all reviews
- ✅ **INSERT**: Users can only create reviews where `auth.uid() = reviewer_id`
- ✅ **UPDATE**: Users can only update their own reviews
- ✅ **DELETE**: Users can only delete their own reviews

### 2. Review Notifications Table (`public.review_notifications`)
**Location**: `supabase/migrations/20251124140500_add_review_notifications.sql`

**Schema**:
- `id` (uuid, Primary Key) - Unique notification identifier
- `recipient_id` (uuid) - References `profiles(id)` - The donor receiving the notification
- `reviewer_id` (uuid) - References `profiles(id)` - The user who wrote the review
- `review_id` (uuid) - References `reviews(id)` - The review that triggered the notification
- `message` (text) - Notification message
- `read` (boolean, default: false) - Whether the notification has been read
- `created_at` (timestamptz) - When the notification was created
- **Unique Constraint**: `(recipient_id, review_id)` - Prevents duplicate notifications

**Indexes**:
- `review_notifications_recipient_id_idx` - For quick lookups by recipient and read status
- `review_notifications_review_id_idx` - For quick lookups by review

**RLS Policies**:
- ✅ **SELECT**: Recipients can only view their own notifications
- ✅ **INSERT**: Reviewers can create notifications when they review
- ✅ **UPDATE**: Recipients can mark their notifications as read

## Frontend Implementation

### 1. Product Detail Page (`src/pages/ProductDetail.tsx`)

**Review Submission Flow**:
1. User views a product/item detail page
2. If logged in and not the item owner, they can submit a review
3. User selects a rating (1-5 stars) and optionally adds a comment
4. On submit:
   - Validates user is logged in
   - Validates user is not reviewing their own item
   - Validates rating is provided (1-5)
   - Creates or updates the review in the database
   - If it's a new review, creates a notification for the donor
   - Updates the UI with the new/updated review

**Key Functions**:
- `handleReviewSubmit()` - Submits or updates a review
- `handleReviewDelete()` - Deletes the user's review
- Fetches existing reviews when the page loads
- Pre-fills form if user already has a review

**Features**:
- Users can edit their existing review
- Users can delete their review
- Users cannot review their own items
- Rating is required, comment is optional
- Real-time updates when reviews are added/updated

### 2. Donor Profile Page (`src/pages/DonorProfile.tsx`)

**Display**:
- Shows all reviews received by the donor
- Displays reviewer name, avatar, rating, comment, and date
- Clickable reviewer names/avatars that navigate to reviewer's profile
- Shows average rating and total review count
- "Show All" / "Show Less" button if more than 5 reviews

**Features**:
- Fetches reviews where `reviewed_id = donor.id`
- Calculates average rating from all reviews
- Displays reviews in chronological order (newest first)
- Clickable reviewer profiles

### 3. User Profile Page (`src/pages/Profile.tsx`)

**Display**:
- Shows reviews received by the current user
- Similar display to Donor Profile but for the logged-in user
- Shows up to 5 reviews in the sidebar
- Clickable reviewer names/avatars

**Features**:
- Fetches reviews where `reviewed_id = current_user.id`
- Limited to 5 reviews in the sidebar view
- Clickable reviewer profiles

### 4. Review Notifications (`src/components/Layout.tsx`)

**Notification Bell Icon**:
- Orange bell icon in the navbar
- Shows unread count badge (up to "9+")
- Dropdown shows recent review notifications
- Real-time updates via Supabase subscriptions

**Features**:
- Fetches notifications where `recipient_id = current_user.id`
- Shows reviewer avatar, name, and message
- "Mark as read" functionality
- "Mark all as read" button
- "View All" button navigates to donor profile
- Clicking a notification marks it as read and navigates to donor profile
- Real-time updates when new notifications arrive

**Notification Flow**:
1. User A reviews User B's item
2. System creates a review in `reviews` table
3. System creates a notification in `review_notifications` table
4. User B sees the notification in their navbar
5. User B can click to view the review on their profile

## User Flow Examples

### Example 1: User Reviews a Donor
1. **Alice** views **Bob's** item on the product detail page
2. Alice clicks "Leave a Review" and rates 5 stars with a comment
3. System creates review: `reviewer_id = Alice.id`, `reviewed_id = Bob.id`
4. System creates notification for Bob
5. Bob sees notification in navbar bell icon
6. Bob clicks notification → navigates to his profile → sees Alice's review
7. Review appears on:
   - Product detail page (in reviews section)
   - Bob's donor profile page
   - Bob's own profile page

### Example 2: User Updates Their Review
1. **Alice** already reviewed **Bob's** item (gave 3 stars)
2. Alice goes back to the product page
3. Alice sees her existing review pre-filled
4. Alice changes rating to 5 stars and updates comment
5. System updates the existing review (doesn't create new notification)
6. Review is updated everywhere it's displayed

### Example 3: User Deletes Their Review
1. **Alice** wants to remove her review of **Bob's** item
2. Alice goes to product page and clicks "Delete Review"
3. System deletes the review from database
4. Review disappears from all pages
5. Notification remains (for historical record)

## Key Features

✅ **Rating System**: 1-5 star ratings (required)
✅ **Comments**: Optional text comments
✅ **Edit Reviews**: Users can update their existing reviews
✅ **Delete Reviews**: Users can delete their own reviews
✅ **Notifications**: Donors get notified when they receive reviews
✅ **Real-time Updates**: Notifications update in real-time
✅ **Profile Links**: Clickable reviewer names/avatars
✅ **Multiple Display Locations**: Reviews shown on product pages, donor profiles, and user profiles
✅ **Security**: RLS policies ensure users can only manage their own reviews
✅ **Validation**: Prevents users from reviewing their own items

## Database Relationships

```
auth.users (donor)
    ↓ (reviewed_id)
reviews
    ↑ (reviewer_id)
auth.users (reviewer)
    ↓
profiles (reviewer profile info)
```

```
profiles (recipient)
    ↓ (recipient_id)
review_notifications
    ↑ (reviewer_id)
profiles (reviewer)
    ↓ (review_id)
reviews
```

## Files Modified/Created

### Database Migrations:
- `supabase/migrations/20251124123000_add_reviews_system.sql` - Reviews table
- `supabase/migrations/20251124140500_add_review_notifications.sql` - Notifications table

### Frontend Components:
- `src/pages/ProductDetail.tsx` - Review submission UI
- `src/pages/DonorProfile.tsx` - Display reviews for a donor
- `src/pages/Profile.tsx` - Display reviews for current user
- `src/components/Layout.tsx` - Review notification bell and dropdown

### Translations:
- `public/locales/en/common.json` - English translations
- `public/locales/fr/common.json` - French translations
- `public/locales/ar/common.json` - Arabic translations
- `public/locales/ur/common.json` - Urdu translations

## Security Considerations

1. **RLS Policies**: All database access is protected by Row Level Security
2. **User Validation**: Frontend validates user cannot review own items
3. **Authentication**: Only authenticated users can create reviews
4. **Ownership**: Users can only edit/delete their own reviews
5. **Notification Access**: Users can only see their own notifications

## Future Enhancements (Potential)

- Review moderation/admin approval
- Review helpfulness voting
- Review replies/responses
- Review filtering and sorting
- Review analytics for donors
- Review verification (only after item received)

