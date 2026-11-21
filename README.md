# MentorLagbe

A full-stack EdTech and tuition marketplace connecting students with verified mentors across Bangladesh. Built with role-based dashboards, server-side pagination, ImgBB media uploads, and Stripe-powered Pro upgrades.

- **Live Frontend:** `https://mentor-lagbe-self.vercel.app`
- **Live Backend API:** `https://mentor-lageb-server.vercel.app`

---

## Demo Credentials

Use the accounts below to test each role directly on the live site:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `123456Aa` |
| **Mentor** | `mentor1@gmail.com` | `123456Aa` |
| **Student** | `student1@gmail.com` | `123456Aa` |

---

## Core Features

### Public & Discovery
- **Tuition Directory (`/tuitions`)**: Server-side pagination, live debounced search, class/category filtering, online/offline mode toggle, and URL-synced filter state.
- **Mentor Directory (`/mentors`)**: Browse verified mentors, filter by subject expertise, and inspect individual mentor profiles with their active tuition listings.
- **Dynamic Home Sections**: Live popular categories and top tuition batches fetched directly from the database.

### Student Workflow
- Apply to active tuition posts with custom notes and track application status (`pending`, `accepted`, `rejected`).
- Upgrade to **Student Pro** via Stripe Checkout for priority access and billing history tracking.
- Manage personal profile details from the student dashboard.

### Mentor Workflow
- Create, edit, and manage tuition listings with ImgBB cover banner uploads.
- Free plan includes up to **2 tuition posts**; upgrade to **Mentor Pro** via Stripe Checkout for unlimited listings and a verified Pro badge.
- Review incoming student applications and accept or reject candidates.

### Admin Workflow
- Platform-wide overview dashboard with user, tuition, and revenue metrics.
- Approve, reject, or moderate submitted tuition posts before they go live.
- Manage platform users (roles/status) and inspect all Stripe payment records.

---

## Tech Stack

### Frontend
- **Framework:** Next.js (App Router, TypeScript)
- **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide Icons, React Hot Toast
- **Authentication:** Better Auth (Email/Password, HTTP-only session cookies, role-based fields)
- **Media Upload:** ImgBB API

### Backend
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB (Native Node.js Driver)
- **Auth & Security:** JSON Web Tokens (`jsonwebtoken`), role-based middleware (`verifyToken`, `verifyAdmin`, `verifyMentor`, `verifyStudent`)
- **Payments:** Stripe Checkout

---

## Frontend Routes

| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Landing page with popular categories & top tuitions |
| `/tuitions` | Public | Paginated & filterable tuition listings |
| `/tuitions/[id]` | Public | Tuition details & application form |
| `/mentors` | Public | Mentor directory with search & subject filters |
| `/mentors/[id]` | Public | Public mentor profile & active posts |
| `/pricing` | Public | Pro plans overview for students & mentors |
| `/sign-in`, `/sign-up` | Public | Authentication pages |
| `/dashboard/student` | Student | Student overview, applications (`/applications`), billing (`/billing`) |
| `/dashboard/mentor` | Mentor | Mentor overview, posts (`/posts`, `/posts/create`, `/posts/edit/[id]`), applications (`/applications`), Pro upgrade (`/pricing`) |
| `/dashboard/admin` | Admin | Admin overview, users (`/users`), tuition moderation (`/tuitions`), payments (`/payments`) |
| `/dashboard/profile` | Authenticated | Shared profile management |
| `/payment/success`, `/payment/cancel` | Authenticated | Stripe Checkout callback pages |

---

## Backend API Endpoints

### Auth & Users
- `POST /api/jwt` — Issue signed JWT for authenticated Better Auth sessions
- `GET /api/users/me` — Fetch logged-in user profile (`verifyToken`)
- `PATCH /api/users/me` — Update logged-in user profile (`verifyToken`)
- `GET /api/mentors` — Public mentor directory with search & subject filters
- `GET /api/mentors/:id` — Public single mentor profile

### Tuitions
- `GET /api/tuitions` — Fetch tuitions with pagination, search, category, and mode filters
- `GET /api/tuitions/:id` — Fetch single tuition post
- `POST /api/tuitions` — Create new tuition post (`verifyToken`, `verifyMentor`)
- `PATCH /api/tuitions/:id` — Update tuition post (`verifyToken`, `verifyMentor`)
- `DELETE /api/tuitions/:id` — Delete tuition post (`verifyToken`, `verifyMentor`)

### Applications
- `POST /api/applications` — Submit application to a tuition post (`verifyToken`, `verifyStudent`)
- `GET /api/applications/student` — Get logged-in student's applications (`verifyToken`, `verifyStudent`)
- `GET /api/applications/mentor` — Get applications for mentor's posts (`verifyToken`, `verifyMentor`)
- `PATCH /api/applications/:id` — Accept or reject an application (`verifyToken`, `verifyMentor`)

### Payments (Stripe)
- `POST /api/payments/create-checkout-session` — Create Stripe Checkout session (`verifyToken`)
- `POST /api/payments/verify-session` — Verify completed payment & activate Pro status (`verifyToken`)
- `GET /api/payments/my` — Fetch logged-in user's payment history (`verifyToken`)

### Admin
- `GET /api/admin/stats` — Platform analytics (`verifyToken`, `verifyAdmin`)
- `GET /api/admin/users` — List all users (`verifyToken`, `verifyAdmin`)
- `PATCH /api/admin/users/:id` — Update user role/status (`verifyToken`, `verifyAdmin`)
- `GET /api/admin/tuitions` — List all tuitions for moderation (`verifyToken`, `verifyAdmin`)
- `PATCH /api/admin/tuitions/:id/status` — Approve or reject tuition post (`verifyToken`, `verifyAdmin`)
- `GET /api/admin/payments` — View all platform transactions (`verifyToken`, `verifyAdmin`)

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (with IP access configured)
- Stripe account (Test Mode keys)
- ImgBB API key

### 1. Backend Setup

```bash
git clone [https://github.com/masud1040/mentorlagbe-server.git](https://github.com/masud1040/mentorlagbe-server.git)
cd mentorlagbe-server
npm install
```

Create a `.env` file in the backend root:

```env
PORT=5000
MONGODB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_32_char_random_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
git clone [https://github.com/masud1040/mentorlagbe-client.git](https://github.com/masud1040/mentorlagbe-client.git)
cd mentorlagbe-client
npm install
```

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
BETTER_AUTH_SECRET=your_32_char_random_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URL=your_mongodb_atlas_connection_string
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `https://mentor-lagbe-self.vercel.app`.

---

## Deployment (Vercel)

1. Deploy the **backend** repository to Vercel with `MONGODB_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, and `CLIENT_URL`.
2. Deploy the **frontend** repository to Vercel with `NEXT_PUBLIC_API_URL` pointing to the live backend URL, plus `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URL`, and `NEXT_PUBLIC_IMGBB_API_KEY`.
3. Update `CLIENT_URL` in the backend Vercel settings to the live frontend URL (no trailing slash) and redeploy.

---

## Author

**Saiful Alam Masud**
- GitHub: [@masud1040](https://github.com/masud1040)
- Portfolio: [masud.ami.bd](https://masud.ami.bd)