# Vertex Markets API Reference

## Overview

Base URL: `http://localhost:3000` (development) / `https://api.vertexmarkets.com` (production)

All API endpoints are prefixed with `/api/v1` unless otherwise noted.

## Authentication

The API uses JWT (JSON Web Token) for authentication.

### Obtaining a Token

```
POST /api/v1/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "role": "Admin",
      "verified": true
    }
  }
}
```

### Using the Token

Include the access token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Token Refresh

```
POST /api/v1/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

Refresh tokens are also accepted via HTTP-only cookie (`refreshToken`) or `x-refresh-token` header.

---

## Endpoints

### Authentication

#### POST /api/v1/register
- **Description:** Create a new user account
- **Auth:** None
- **Body:**
  - `email` (string, required) - User email
  - `password` (string, required, min 8 chars) - User password
  - `profile.firstName` (string, optional)
  - `profile.lastName` (string, optional)
  - `profile.phone` (string, optional)
- **Success:** 201
- **Errors:** 400 (Validation), 409 (Email exists)

#### POST /api/v1/login
- **Description:** Authenticate user
- **Auth:** None
- **Body:**
  - `email` (string, required)
  - `password` (string, required)
- **Success:** 200 - Returns accessToken, user object
- **Errors:** 401 (Invalid credentials)

#### POST /api/v1/logout
- **Description:** Logout current session
- **Auth:** None (optional)
- **Body:**
  - `refreshToken` (string, optional)
- **Success:** 200

#### POST /api/v1/refresh
- **Description:** Refresh access token
- **Auth:** None (optional)
- **Body:**
  - `refreshToken` (string, optional)
- **Success:** 200 - Returns new accessToken
- **Errors:** 401

#### POST /api/v1/forgot-password
- **Description:** Request password reset
- **Auth:** None
- **Body:**
  - `email` (string, required)
- **Success:** 200

#### POST /api/v1/reset-password
- **Description:** Reset password with token
- **Auth:** None
- **Body:**
  - `token` (string, required)
  - `newPassword` (string, required, min 8 chars)
- **Success:** 200
- **Errors:** 400 (Invalid token)

#### POST /api/v1/verify-email
- **Description:** Verify email address
- **Auth:** None
- **Body:**
  - `token` (string, required)
- **Success:** 200
- **Errors:** 400

#### POST /api/v1/change-password
- **Description:** Change password (authenticated)
- **Auth:** Bearer token or body accessToken
- **Body:**
  - `oldPassword` (string, required)
  - `newPassword` (string, required, min 8 chars)
- **Success:** 200
- **Errors:** 401

#### PATCH /api/v1/profile
- **Description:** Update user profile
- **Auth:** Bearer token or body accessToken
- **Body:**
  - `firstName` (string, optional)
  - `lastName` (string, optional)
  - `phone` (string, optional)
- **Success:** 200

#### GET /api/v1/auth/status
- **Description:** Auth service health check
- **Auth:** None
- **Success:** 200

#### GET /api/v1/auth/status
- **Description:** Auth service health check (alternate)
- **Auth:** None
- **Success:** 200

---

### Users

#### GET /api/v1/users/me
- **Description:** Get current user profile
- **Auth:** Bearer token
- **Success:** 200 - Returns user object
- **Errors:** 401

#### PATCH /api/v1/users/me
- **Description:** Update own profile
- **Auth:** Bearer token
- **Body:** (optional fields)
  - `firstName` (string)
  - `lastName` (string)
  - `phone` (string)
- **Success:** 200

#### GET /api/v1/users
- **Description:** List all users (admin)
- **Auth:** Bearer token (Admin + user:read permission)
- **Query:**
  - `page` (integer, default: 1)
  - `limit` (integer, default: 20, max: 100)
  - `sortBy` (string)
  - `sortOrder` (asc/desc)
  - `q` (string, search query)
  - `role` (Admin/Customer)
  - `active` (boolean)
  - `verified` (boolean)
- **Success:** 200

#### GET /api/v1/users/:id
- **Description:** Get user by ID (admin)
- **Auth:** Bearer token (Admin + user:read)
- **Path:** `id` - User ID
- **Success:** 200
- **Errors:** 401, 403, 404

#### PUT /api/v1/users/:id
- **Description:** Replace user (admin)
- **Auth:** Bearer token (Admin + user:update)
- **Path:** `id` - User ID
- **Body:**
  - `email` (string)
  - `role` (Admin/Customer)
  - `profile` (object)
  - `active` (boolean)
- **Success:** 200

#### DELETE /api/v1/users/:id
- **Description:** Soft-delete user (admin)
- **Auth:** Bearer token (Admin + user:delete)
- **Path:** `id` - User ID
- **Success:** 200

#### POST /api/v1/users/:id/block
- **Description:** Block user (admin)
- **Auth:** Bearer token (Admin + user:block)
- **Path:** `id` - User ID
- **Body:** `reason` (string, optional)
- **Success:** 200

#### POST /api/v1/users/:id/unblock
- **Description:** Unblock user (admin)
- **Auth:** Bearer token (Admin + user:block)
- **Path:** `id` - User ID
- **Success:** 200

#### PATCH /api/v1/users/:id/role
- **Description:** Change user role (admin)
- **Auth:** Bearer token (Admin + user:role)
- **Path:** `id` - User ID
- **Body:** `role` (required, Admin/Customer)
- **Success:** 200

#### POST /api/v1/users/:id/restore
- **Description:** Restore soft-deleted user (admin)
- **Auth:** Bearer token (Admin + user:update)
- **Path:** `id` - User ID
- **Success:** 200

---

### CMS

#### GET /api/v1/cms/status
- **Description:** CMS service health check
- **Auth:** None
- **Success:** 200

#### GET /api/v1/cms/hero
- **Description:** List hero section content
- **Auth:** None
- **Success:** 200

#### GET /api/v1/cms/hero/:id
- **Description:** Get hero content by ID
- **Auth:** None
- **Path:** `id` - Content ID
- **Success:** 200
- **Errors:** 404

#### POST /api/v1/cms/hero
- **Description:** Create hero content (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Body:**
  - `section` (string, required)
  - `content` (object, required)
  - `active` (boolean, optional)
- **Success:** 201

#### PUT /api/v1/cms/hero/:id
- **Description:** Upsert hero content (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Content ID
- **Body:** Same as POST
- **Success:** 200

#### PATCH /api/v1/cms/hero/:id
- **Description:** Patch hero content (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Content ID
- **Body:** Partial content/active fields
- **Success:** 200

#### DELETE /api/v1/cms/hero/:id
- **Description:** Delete hero content (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Content ID
- **Success:** 200

**Available sections:** hero, about, features, statistics, tradingPlatforms, markets, partners, testimonials, faq, footer, seo

---

### Markets

#### GET /api/v1/markets
- **Description:** List all markets
- **Auth:** None
- **Query:** page, limit, sortBy, sortOrder, active, type, q
- **Success:** 200

#### GET /api/v1/markets/:id
- **Description:** Get market by ID
- **Auth:** None
- **Path:** `id` - Market ID
- **Success:** 200
- **Errors:** 404

#### GET /api/v1/markets/slug/:slug
- **Description:** Get market by slug
- **Auth:** None
- **Path:** `slug` - Market slug
- **Success:** 200
- **Errors:** 404

#### POST /api/v1/markets
- **Description:** Create market (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Body:**
  - `name` (string, required)
  - `slug` (string, required)
  - `description` (string, required)
  - `icon` (string, optional)
  - `order` (integer, optional)
  - `active` (boolean, optional)
- **Success:** 201

#### PUT /api/v1/markets/:id
- **Description:** Update market (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Market ID
- **Body:** Same as POST
- **Success:** 200

#### PATCH /api/v1/markets/:id
- **Description:** Patch market (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Market ID
- **Body:** Partial market fields
- **Success:** 200

#### DELETE /api/v1/markets/:id
- **Description:** Delete market (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Market ID
- **Success:** 200

---

### Platforms

#### GET /api/v1/platforms
- **Description:** List trading platforms
- **Auth:** None
- **Query:** page, limit, sortBy, sortOrder, active, q
- **Success:** 200

#### GET /api/v1/platforms/:id
- **Description:** Get platform by ID
- **Auth:** None
- **Path:** `id` - Platform ID
- **Success:** 200
- **Errors:** 404

#### GET /api/v1/platforms/slug/:slug
- **Description:** Get platform by slug
- **Auth:** None
- **Path:** `slug` - Platform slug
- **Success:** 200
- **Errors:** 404

#### POST /api/v1/platforms
- **Description:** Create platform (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Body:**
  - `name` (string, required)
  - `slug` (string, required)
  - `description` (string, required)
  - `logo` (string, optional)
  - `features` (array, optional)
  - `supportedMarkets` (array, optional)
  - `downloadLinks` (object, optional)
  - `order` (integer, optional)
  - `active` (boolean, optional)
- **Success:** 201

#### PUT /api/v1/platforms/:id
- **Description:** Update platform (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Platform ID
- **Body:** Same as POST
- **Success:** 200

#### PATCH /api/v1/platforms/:id
- **Description:** Patch platform (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Platform ID
- **Body:** Partial platform fields
- **Success:** 200

#### DELETE /api/v1/platforms/:id
- **Description:** Delete platform (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Platform ID
- **Success:** 200

---

### Blog

#### GET /api/v1/blog
- **Description:** List published blog posts
- **Auth:** None
- **Query:** page, limit, sortBy, sortOrder, q
- **Success:** 200

#### GET /api/v1/blog/:id
- **Description:** Get blog post by ID
- **Auth:** None
- **Path:** `id` - Blog post ID
- **Success:** 200
- **Errors:** 404

#### GET /api/v1/blog/slug/:slug
- **Description:** Get blog post by slug
- **Auth:** None
- **Path:** `slug` - Blog post slug
- **Success:** 200
- **Errors:** 404

#### POST /api/v1/blog
- **Description:** Create blog post (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Body:**
  - `title` (string, required)
  - `content` (string, required)
  - `slug` (string, optional)
  - `excerpt` (string, optional)
  - `coverImage` (string, optional)
  - `author` (string, optional)
  - `category` (string, optional - category ID)
  - `tags` (array of strings, optional)
  - `status` (string: draft/published, optional)
  - `active` (boolean, optional)
- **Success:** 201

#### PUT /api/v1/blog/:id
- **Description:** Update blog post (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Blog post ID
- **Body:** Same as POST
- **Success:** 200

#### PATCH /api/v1/blog/:id
- **Description:** Patch blog post (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Blog post ID
- **Body:** Partial blog fields
- **Success:** 200

#### DELETE /api/v1/blog/:id
- **Description:** Delete blog post (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Blog post ID
- **Success:** 200

#### GET /api/v1/blog/categories
- **Description:** List blog categories
- **Auth:** None
- **Query:** page, limit, sortBy, sortOrder
- **Success:** 200

#### POST /api/v1/blog/categories
- **Description:** Create category (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Body:**
  - `name` (string, required)
  - `slug` (string, optional)
  - `description` (string, optional)
- **Success:** 201

#### PUT/PATCH/DELETE /api/v1/blog/categories/:id
- **Description:** Update/patch/delete category (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Category ID
- **Body:** Category fields
- **Success:** 200

#### GET /api/v1/blog/tags
- **Description:** List blog tags
- **Auth:** None
- **Query:** page, limit, sortBy, sortOrder
- **Success:** 200

#### POST /api/v1/blog/tags
- **Description:** Create tag (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Body:**
  - `name` (string, required)
  - `slug` (string, optional)
- **Success:** 201

#### PUT/PATCH/DELETE /api/v1/blog/tags/:id
- **Description:** Update/patch/delete tag (admin)
- **Auth:** Bearer token (Admin + cms:write)
- **Path:** `id` - Tag ID
- **Success:** 200

---

### Contact

#### POST /api/v1/contact
- **Description:** Submit contact message
- **Auth:** None
- **Body:**
  - `fullName` (string, required, 2-200 chars)
  - `email` (string, required, email format)
  - `phone` (string, required, 7-25 chars)
  - `country` (string, required, 2-100 chars)
  - `subject` (string, required, 3-150 chars)
  - `message` (string, required, 10-4000 chars)
  - `department` (string, optional, max 100 chars)
- **Success:** 201
- **Errors:** 400

#### GET /api/v1/contact/status/:id
- **Description:** Check contact status (public)
- **Auth:** None
- **Path:** `id` - Contact ID
- **Success:** 200
- **Errors:** 404

#### GET /api/v1/contact
- **Description:** List contacts (admin)
- **Auth:** Bearer token (Admin + contact:write)
- **Query:** page, limit, sortBy, sortOrder, q, status, assignedTo, active
- **Success:** 200
- **Status values:** new, in_progress, replied, closed

#### GET /api/v1/contact/:id
- **Description:** Get contact by ID (admin)
- **Auth:** Bearer token (Admin + contact:write)
- **Path:** `id` - Contact ID
- **Success:** 200
- **Errors:** 404

#### PUT /api/v1/contact/:id
- **Description:** Replace contact (admin)
- **Auth:** Bearer token (Admin + contact:write)
- **Path:** `id` - Contact ID
- **Body:** Full contact data
- **Success:** 200

#### PATCH /api/v1/contact/:id
- **Description:** Partially update contact (admin)
- **Auth:** Bearer token (Admin + contact:write)
- **Path:** `id` - Contact ID
- **Body:** Partial contact fields
- **Success:** 200

#### DELETE /api/v1/contact/:id
- **Description:** Soft-delete contact (admin)
- **Auth:** Bearer token (Admin + contact:write)
- **Path:** `id` - Contact ID
- **Success:** 200

#### PATCH /api/v1/contact/:id/status
- **Description:** Update contact status (admin)
- **Auth:** Bearer token (Admin + contact:write)
- **Path:** `id` - Contact ID
- **Body:** `status` (required: new/in_progress/replied/closed)
- **Success:** 200

#### PATCH /api/v1/contact/:id/assign
- **Description:** Assign contact (admin)
- **Auth:** Bearer token (Admin + contact:write)
- **Path:** `id` - Contact ID
- **Body:** `assignedTo` (string)
- **Success:** 200

#### POST /api/v1/contact/:id/reply
- **Description:** Reply to contact (admin)
- **Auth:** Bearer token (Admin + contact:write)
- **Path:** `id` - Contact ID
- **Body:**
  - `replyMessage` (string, required, 1-4000 chars)
  - `fromEmail` (string, optional, email format)
  - `assignedTo` (string, optional)
- **Success:** 200

---

### Newsletter

#### POST /api/v1/newsletter/subscribe
- **Description:** Subscribe to newsletter
- **Auth:** None
- **Body:**
  - `email` (string, required)
  - `fullName` (string, optional)
  - `source` (string, optional)
  - `tags` (array, optional)
- **Success:** 201
- **Errors:** 400, 409

#### POST /api/v1/newsletter/unsubscribe
- **Description:** Unsubscribe from newsletter
- **Auth:** None
- **Body:** `email` (string, required)
- **Success:** 200
- **Errors:** 400, 404

#### GET /api/v1/newsletter/status/:email
- **Description:** Get subscription status
- **Auth:** None
- **Path:** `email` - Subscriber email
- **Success:** 200
- **Errors:** 400, 404

#### GET /api/v1/newsletter
- **Description:** List subscribers (admin)
- **Auth:** Bearer token (Admin + newsletter:write)
- **Query:** page, limit, sortBy, sortOrder, q, status, active, source, subscribedFrom, subscribedTo
- **Success:** 200

#### GET /api/v1/newsletter/:id
- **Description:** Get subscriber by ID (admin)
- **Auth:** Bearer token (Admin + newsletter:write)
- **Path:** `id` - Subscriber ID
- **Success:** 200
- **Errors:** 404

#### PUT/PATCH /api/v1/newsletter/:id
- **Description:** Update subscriber (admin)
- **Auth:** Bearer token (Admin + newsletter:write)
- **Path:** `id` - Subscriber ID
- **Body:** email, fullName, source, tags, active
- **Success:** 200

#### DELETE /api/v1/newsletter/:id
- **Description:** Soft-delete subscriber (admin)
- **Auth:** Bearer token (Admin + newsletter:write)
- **Path:** `id` - Subscriber ID
- **Success:** 200

#### PATCH /api/v1/newsletter/:id/status
- **Description:** Update subscriber status (admin)
- **Auth:** Bearer token (Admin + newsletter:write)
- **Path:** `id` - Subscriber ID
- **Body:** `status` (required: subscribed/unsubscribed)
- **Success:** 200

---

### Careers

#### GET /api/v1/careers
- **Description:** List open jobs
- **Auth:** None
- **Query:** page, limit, sortBy, sortOrder, q, featured, department, location, employmentType, experienceLevel
- **Employment Types:** Full-time, Part-time, Contract, Freelance, Internship, Temporary
- **Experience Levels:** Entry, Junior, Mid-Level, Senior, Lead, Manager, Director, Executive
- **Success:** 200

#### GET /api/v1/careers/:id
- **Description:** Get job by ID
- **Auth:** None
- **Path:** `id` - Job ID
- **Success:** 200
- **Errors:** 404

#### GET /api/v1/careers/slug/:slug
- **Description:** Get job by slug
- **Auth:** None
- **Path:** `slug` - Job slug
- **Success:** 200
- **Errors:** 404

#### POST /api/v1/careers/:id/apply
- **Description:** Apply for job
- **Auth:** None
- **Path:** `id` - Job ID
- **Body:**
  - `fullName` (string, required)
  - `email` (string, required)
  - `phone` (string, required)
  - `coverLetter` (string, required)
  - `resumeUrl` (string, optional)
  - `linkedIn` (string, optional)
  - `portfolio` (string, optional)
  - `referral` (string, optional)
- **Success:** 201

#### GET /api/v1/careers/application/:applicationId/status
- **Description:** Check application status
- **Auth:** None
- **Path:** `applicationId` - Application ID
- **Success:** 200
- **Errors:** 404

#### GET /api/v1/careers/admin/jobs
- **Description:** List all jobs (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Query:** page, limit, sortBy, sortOrder, q, status, department, active
- **Status values:** open, closed, draft
- **Success:** 200

#### POST /api/v1/careers
- **Description:** Create job (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Body:** Full job fields
- **Success:** 201

#### PUT/PATCH /api/v1/careers/:id
- **Description:** Update job (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Path:** `id` - Job ID
- **Body:** Job fields
- **Success:** 200

#### DELETE /api/v1/careers/:id
- **Description:** Delete job (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Path:** `id` - Job ID
- **Success:** 200

#### GET /api/v1/careers/admin/applications
- **Description:** List applications (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Query:** page, limit, sortBy, sortOrder, q, status, jobId
- **Status values:** new, reviewed, shortlisted, interviewed, offered, hired, rejected
- **Success:** 200

#### GET /api/v1/careers/admin/applications/:id
- **Description:** Get application by ID (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Path:** `id` - Application ID
- **Success:** 200
- **Errors:** 404

#### PATCH /api/v1/careers/admin/applications/:id/status
- **Description:** Update application status (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Path:** `id` - Application ID
- **Body:** `status` (required)
- **Success:** 200

#### PATCH /api/v1/careers/admin/applications/:id/assign
- **Description:** Assign application (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Path:** `id` - Application ID
- **Body:** `assignedTo` (required)
- **Success:** 200

#### PATCH /api/v1/careers/admin/applications/:id/notes
- **Description:** Update application notes (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Path:** `id` - Application ID
- **Body:** `notes` (required)
- **Success:** 200

#### DELETE /api/v1/careers/admin/applications/:id
- **Description:** Delete application (admin)
- **Auth:** Bearer token (Admin + careers:write)
- **Path:** `id` - Application ID
- **Success:** 200

---

### Partners

#### POST /api/v1/partners/register
- **Description:** Register as partner
- **Auth:** None
- **Body:**
  - `fullName` (string, required, 2-200 chars)
  - `email` (string, required)
  - `phone` (string, required, 7-25 chars)
  - `country` (string, required, 2-100 chars)
  - `partnerType` (string, required)
  - `companyName` (string, optional, max 200)
  - `city` (string, optional, max 100)
  - `website` (string, optional, url)
  - `experience` (string, optional, max 500)
  - `monthlyClients` (string, optional, max 100)
  - `businessDescription` (string, optional, max 2000)
  - `referralSource` (string, optional, max 200)
- **Partner Types:** Introducing Broker (IB), Affiliate Partner, Regional Partner, Business Partner, Institutional Partner
- **Success:** 201
- **Errors:** 400, 409

#### POST /api/v1/partners/referral
- **Description:** Submit client referral
- **Auth:** None
- **Body:** clientName, clientEmail, clientPhone, country, referredBy, tradingExperience, estimatedDeposit, message
- **Success:** 201
- **Errors:** 400

#### GET /api/v1/partners/status/:id
- **Description:** Check partner status
- **Auth:** None
- **Path:** `id` - Partner ID
- **Success:** 200
- **Errors:** 404

#### GET /api/v1/partners
- **Description:** List partners (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Query:** page, limit, sortBy, sortOrder, q, status, partnerType, assignedTo, active
- **Status values:** pending, under_review, approved, rejected
- **Success:** 200

#### GET /api/v1/partners/:id
- **Description:** Get partner by ID (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Partner ID
- **Success:** 200
- **Errors:** 404

#### PUT/PATCH /api/v1/partners/:id
- **Description:** Update partner (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Partner ID
- **Body:** Partner fields
- **Success:** 200

#### DELETE /api/v1/partners/:id
- **Description:** Soft-delete partner (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Partner ID
- **Success:** 200

#### PATCH /api/v1/partners/:id/status
- **Description:** Update partner status (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Partner ID
- **Body:** `status` (required)
- **Success:** 200

#### PATCH /api/v1/partners/:id/assign
- **Description:** Assign partner (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Partner ID
- **Body:** `assignedTo` (required)
- **Success:** 200

#### PATCH /api/v1/partners/:id/notes
- **Description:** Update partner notes (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Partner ID
- **Body:** `notes` (required)
- **Success:** 200

#### GET /api/v1/partners/referrals
- **Description:** List referrals (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Query:** page, limit, sortBy, sortOrder, q, status, referredBy
- **Referral statuses:** new, contacted, qualified, converted, closed
- **Success:** 200

#### GET /api/v1/partners/referrals/:id
- **Description:** Get referral by ID (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Referral ID
- **Success:** 200
- **Errors:** 404

#### PATCH /api/v1/partners/referrals/:id/status
- **Description:** Update referral status (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Referral ID
- **Body:** `status` (required)
- **Success:** 200

#### DELETE /api/v1/partners/referrals/:id
- **Description:** Soft-delete referral (admin)
- **Auth:** Bearer token (Admin + partners:write)
- **Path:** `id` - Referral ID
- **Success:** 200

---

### Uploads

#### GET /api/v1/uploads/file/:fileName
- **Description:** Serve file by filename (public)
- **Auth:** None
- **Path:** `fileName` - File name
- **Success:** 200 (file stream)
- **Errors:** 404

#### GET /api/v1/uploads/:id
- **Description:** Get file metadata (public)
- **Auth:** None
- **Path:** `id` - File ID
- **Success:** 200
- **Errors:** 404

#### POST /api/v1/uploads/avatar
- **Description:** Upload avatar (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Body:** `file` (multipart/form-data, image)
- **Success:** 201

#### POST /api/v1/uploads/blog-image
- **Description:** Upload blog image (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Body:** `file` (multipart/form-data, image)
- **Success:** 201

#### POST /api/v1/uploads/cms-image
- **Description:** Upload CMS image (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Body:** `file` (multipart/form-data, image)
- **Success:** 201

#### POST /api/v1/uploads/platform-image
- **Description:** Upload platform image (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Body:** `file` (multipart/form-data, image)
- **Success:** 201

#### POST /api/v1/uploads/market-icon
- **Description:** Upload market icon (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Body:** `file` (multipart/form-data, image)
- **Success:** 201

#### POST /api/v1/uploads/resume
- **Description:** Upload resume (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Body:** `file` (multipart/form-data, PDF/DOCX)
- **Success:** 201

#### POST /api/v1/uploads/document
- **Description:** Upload document (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Body:** `file` (multipart/form-data)
- **Success:** 201

#### GET /api/v1/uploads
- **Description:** List uploaded files (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Query:** page, limit, sortBy, sortOrder, category, mimeType, active, q
- **Categories:** avatar, blog, cms, platform, market, partner, resume, document
- **Success:** 200

#### GET /api/v1/uploads/:id/details
- **Description:** Get file details (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Path:** `id` - File ID
- **Success:** 200
- **Errors:** 404

#### PATCH /api/v1/uploads/:id
- **Description:** Update file metadata (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Path:** `id` - File ID
- **Body:** `active` (boolean)
- **Success:** 200

#### DELETE /api/v1/uploads/:id
- **Description:** Soft-delete file (admin)
- **Auth:** Bearer token (Admin + uploads:write)
- **Path:** `id` - File ID
- **Success:** 200

---

### Dashboard

#### GET /api/v1/dashboard
- **Description:** Get full dashboard data (admin)
- **Auth:** Bearer token (Admin + dashboard:read)
- **Query:** `limit` (integer, default: 10)
- **Success:** 200 - Returns statistics, dashboard cards, recent activity

#### GET /api/v1/dashboard/statistics
- **Description:** Get aggregated statistics (admin)
- **Auth:** Bearer token (Admin + dashboard:read)
- **Success:** 200 - Module counts

#### GET /api/v1/dashboard/recent
- **Description:** Get recent items (admin)
- **Auth:** Bearer token (Admin + dashboard:read)
- **Query:** `type` (users/blog/contacts/applications/partners/uploads), `limit` (default: 10)
- **Success:** 200

#### GET /api/v1/dashboard/system
- **Description:** Get system health (admin)
- **Auth:** Bearer token (Admin + dashboard:read)
- **Success:** 200 - System info including uptime, routes, memory

#### GET /api/v1/dashboard/activity
- **Description:** Get activity feed (admin)
- **Auth:** Bearer token (Admin + dashboard:read)
- **Query:** `limit` (integer, default: 20, max: 100)
- **Success:** 200

---

### Search

#### GET /search
- **Description:** Global search across all modules
- **Auth:** Optional (Bearer token)
- **Query:**
  - `q` (string) - Search query
  - `page` (integer, default: 1)
  - `limit` (integer, default: 20)
  - `sortBy` (string, default: createdAt)
  - `sortOrder` (asc/desc, default: desc)
  - `active`, `status`, `category`, `type`, `country`, `department`, `partnerType`, `market`, `platform`, `dateFrom`, `dateTo`
- **Supported modules:** users, cms, markets, platforms, blog, contact, newsletter, careers, partners, uploads
- **Success:** 200 - Results grouped by module

#### GET /search/:module
- **Description:** Search within a specific module
- **Auth:** Optional (required for admin modules: contact, newsletter, partners, uploads)
- **Path:** `module` - Module name (users/cms/markets/platforms/blog/contact/newsletter/careers/partners/uploads)
- **Query:** Same as global search
- **Success:** 200

---

### Health

#### GET /health
- **Description:** API health check
- **Auth:** None
- **Success:** 200 - `{ "ok": true }`

---

### Documentation

#### GET /api/v1/docs
- **Description:** Interactive Swagger UI
- **Auth:** None
- **Success:** 200 (HTML page)

#### GET /api/v1/docs.json
- **Description:** OpenAPI specification JSON
- **Auth:** None
- **Success:** 200 (JSON)

---

## Common Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "details": []
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 50,
    "pageSize": 10,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "data": [ ... ]
  }
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Successful request |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Validation Failed - Input validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

Default: 100 requests per 15-minute window per IP address.

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```
Status code: 429

---

## Roles & Permissions

### Roles
- **Admin** - Full access to all management features
- **Customer** - Limited to self-service operations

### Permissions (Admin)
| Permission | Description |
|------------|-------------|
| user:read | View user details |
| user:update | Update user information |
| user:delete | Delete user accounts |
| user:block | Block/unblock users |
| user:role | Change user roles |
| cms:write | Manage CMS content |
| contact:write | Manage contact inquiries |
| newsletter:write | Manage newsletter subscribers |
| careers:write | Manage jobs and applications |
| partners:write | Manage partners and referrals |
| uploads:write | Manage file uploads |
| dashboard:read | View dashboard data |
| search:global | Perform global searches |
| search:module | Perform module searches |

