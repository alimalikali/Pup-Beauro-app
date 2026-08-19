# Mithaq (مِيثَاق) — Complete Build Plan for Claude Code
> "A covenant, not just a match."
> Muslim-first, purpose-driven matrimonial platform
> Status: Prototype done. Now building production version.

---

## 1. WHAT THIS APP IS

Mithaq is a global Muslim matrimonial platform where the core differentiator
is PURPOSE ALIGNMENT — not demographics. Users define their life mission
(social reform, career, religious goals) and the system matches them with
others whose life direction is compatible.

Key differentiators vs existing apps (Muzz, Shaadi, Rishta):
- Purpose statement matched via AI embeddings (not just filters)
- Strict CNIC/ID verification + manual admin review before profiles go live
- Mutual interest gate — chat only unlocks when BOTH express interest
- Priority sliders — users weight what matters (deen, education, career, family)
- Wali/guardian CC option on conversations
- Monetization after 1st free match (freemium model)

---

## 2. TARGET AUDIENCE

- Launch: Pakistan-first (Lahore, Karachi, Islamabad)
- Phase 2: UK, Canada, US diaspora
- Audience: Serious Muslim users aged 22–35 who want nikah, not dating

---

## 3. TECH STACK

### Mobile App (User-facing)
- React Native (Expo)
- Redux Toolkit (state management)
- Socket.io client (real-time chat)
- Axios (API calls)
- React Navigation (routing)
- Framer Motion / Reanimated (animations)
- Three.js / @react-three/fiber (3D landing elements)

### Web App (same frontend, responsive)
- Vite + React
- Shadcn/ui (component library)
- Tailwind CSS
- Redux Toolkit
- Socket.io client

### Backend (API Server)
- Node.js + Express
- PostgreSQL (database)
- Sequelize ORM
- Socket.io (real-time chat)
- JWT authentication
- Multer (file uploads for CNIC)
- OpenAI API (embeddings for purpose matching)
- pgvector extension (cosine similarity matching)

### Admin Panel (Web)
- Vite + React + Tailwind
- Same backend API with admin role
- Separate route: /admin

---

## 4. DESIGN SYSTEM

### Colors
```
--pink-hot:    #f0134d   (primary CTA, accents)
--pink-mid:    #f9a8d4   (borders, muted elements)
--pink-light:  #fce7f3   (card fills, pills)
--bg-page:     #fff5f7   (page background)
--text-dark:   #1a0a10   (headings)
--text-mid:    #6b4455   (body copy)
--text-soft:   #c084a0   (captions, hints)
--glass:       rgba(255,255,255,0.65)
--glass-border: rgba(255,255,255,0.85)
```

### Aesthetic
- Glassmorphism cards (backdrop-filter: blur(20px))
- Animated gradient mesh background (soft blush pink orbs)
- Smooth spring animations (cubic-bezier(0.34, 1.56, 0.64, 1))
- Generous whitespace — never crowded
- Gradient text for accent words
- Floating decorative SVG elements (crescent, heart, arabesque)
- Reference: Linear.app smoothness + soft Islamic wedding invitation warmth

### Typography
- Font: Inter
- Arabic elements: Noto Naskh Arabic
- Hero: 72px, weight 900, letter-spacing -2px
- Headings: weight 700-800
- Body: 16px, weight 400, line-height 1.7

---

## 5. DATABASE SCHEMA (PostgreSQL + Sequelize)

### Users table
```sql
id          UUID PRIMARY KEY
email       VARCHAR UNIQUE NOT NULL
phone       VARCHAR
password    VARCHAR (bcrypt hashed)
role        ENUM('user', 'admin') DEFAULT 'user'
gender      ENUM('male', 'female')
is_verified BOOLEAN DEFAULT false
is_active   BOOLEAN DEFAULT false  -- only true after admin approves
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### Profiles table
```sql
id              UUID PRIMARY KEY
user_id         UUID FK → Users
display_name    VARCHAR
age             INTEGER
city            VARCHAR
sect            VARCHAR (Sunni, Shia, etc.)
education       VARCHAR
profession      VARCHAR
family_type     VARCHAR
bio             TEXT
purpose_statement TEXT          -- free text, long form
purpose_embedding VECTOR(1536)  -- OpenAI embedding stored via pgvector
priority_deen       INTEGER DEFAULT 50  -- 0-100 weight
priority_education  INTEGER DEFAULT 50
priority_career     INTEGER DEFAULT 50
priority_family     INTEGER DEFAULT 50
priority_location   INTEGER DEFAULT 50
life_tags       TEXT[]  -- ['social reform', 'education', 'da'wah']
is_published    BOOLEAN DEFAULT false
profile_views   INTEGER DEFAULT 0
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### VerificationDocs table
```sql
id          UUID PRIMARY KEY
user_id     UUID FK → Users
cnic_front  VARCHAR (file path/URL)
cnic_back   VARCHAR (file path/URL)
status      ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
admin_note  TEXT
reviewed_by UUID FK → Users (admin)
reviewed_at TIMESTAMP
created_at  TIMESTAMP
```

### Matches table
```sql
id              UUID PRIMARY KEY
user_a_id       UUID FK → Users
user_b_id       UUID FK → Users
status          ENUM('pending', 'mutual', 'rejected') DEFAULT 'pending'
compat_score    FLOAT   -- cosine similarity score 0-1
initiated_by    UUID FK → Users
created_at      TIMESTAMP
updated_at      TIMESTAMP
UNIQUE(user_a_id, user_b_id)
```

### Conversations table
```sql
id              UUID PRIMARY KEY
match_id        UUID FK → Matches
wali_email      VARCHAR  -- optional guardian CC
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP
```

### Messages table
```sql
id              UUID PRIMARY KEY
conversation_id UUID FK → Conversations
sender_id       UUID FK → Users
content         TEXT
is_read         BOOLEAN DEFAULT false
created_at      TIMESTAMP
```

### Subscriptions table
```sql
id              UUID PRIMARY KEY
user_id         UUID FK → Users
plan            ENUM('free', 'premium')
status          ENUM('active', 'cancelled', 'expired')
started_at      TIMESTAMP
expires_at      TIMESTAMP
payment_ref     VARCHAR
```

---

## 6. BACKEND API ROUTES (Express)

### Auth routes (/api/auth)
```
POST   /register          Create account (name, email, phone, gender, city, password)
POST   /login             JWT login
POST   /logout            Invalidate token
POST   /refresh           Refresh JWT
GET    /me                Get current user
```

### Profile routes (/api/profile)
```
GET    /                  Get own profile
PUT    /                  Update own profile
POST   /purpose           Save purpose statement → triggers embedding generation
POST   /priorities        Save priority slider values
GET    /completeness      Get profile completion %
```

### Verification routes (/api/verification)
```
POST   /upload            Upload CNIC docs (Multer)
GET    /status            Check verification status
```

### Matching routes (/api/matches)
```
GET    /feed              Get today's matches (AI-scored, paginated)
POST   /interest/:userId  Express interest in a user
GET    /mutual            Get all mutual matches
PUT    /:matchId/skip     Skip a match
```

### Chat routes (/api/chat)
```
GET    /conversations         List all active conversations
GET    /conversations/:id     Get conversation + messages
POST   /conversations/:id/wali  Add wali email
```

### Admin routes (/api/admin) — requires admin role JWT
```
GET    /verifications         List pending verifications
PUT    /verifications/:id     Approve or reject with note
GET    /users                 List all users
PUT    /users/:id/suspend     Suspend a user
GET    /stats                 Dashboard stats
GET    /reports               List flagged content
```

### Socket.io events
```
// Client emits:
join_conversation  { conversationId }
send_message       { conversationId, content }
typing             { conversationId }
stop_typing        { conversationId }

// Server emits:
new_message        { message object }
user_typing        { userId }
user_stop_typing   { userId }
match_notification { match object }  -- pushed when mutual interest detected
```

---

## 7. AI MATCHING SYSTEM

### How it works:
1. User saves purpose statement (free text)
2. Backend calls OpenAI embeddings API:
   ```js
   const embedding = await openai.embeddings.create({
     model: "text-embedding-3-small",
     input: purposeStatement
   })
   ```
3. Store 1536-dim vector in pgvector column
4. When generating feed for User A, run:
   ```sql
   SELECT p.*, 
     1 - (purpose_embedding <=> $1) AS compat_score
   FROM profiles p
   WHERE p.user_id != $2
     AND p.is_published = true
     AND p.user_id NOT IN (already_seen_ids)
   ORDER BY purpose_embedding <=> $1
   LIMIT 10;
   ```
5. Apply priority weights on top of base score:
   ```js
   finalScore = baseEmbeddingScore * 0.5 +
                weightedPriorityMatch * 0.3 +
                demographicMatch * 0.2
   ```
6. Return sorted feed with compat_score as percentage

---

## 8. FRONTEND SCREENS

### Mobile App Screens (React Native)

#### Screen 0 — Splash
- Animated crescent SVG drawing itself
- "Mithaq مِيثَاق" logo fade in
- "A covenant, not just a match."
- Auto-navigates to Onboarding or Home after 2.5s

#### Screen 1 — Landing / Marketing page
- Full gradient mesh animated background
- Three.js 3D floating objects (crescent, rings, particles)
- Hero headline: "Ready to find your covenant partner?"
- CTA: "Begin Your Journey"
- Sliding match notification popup (top-right)
- Sections: How it Works, Stats, Testimonials, Footer

#### Screen 2 — Register (Step 1 of 4)
- Glass card, centered
- Fields: Name, Email, Phone, Gender (pill toggle), City, Password
- Progress dots: ● ○ ○ ○
- "Continue →" gradient button

#### Screen 3 — Purpose Setup (Step 2 of 4)
- "What is your life's direction?"
- Large textarea with AI tag suggestions appearing as user types
- 5 priority sliders (Deen, Education, Career, Family, Location)
- Each slider pink gradient, shows % value
- "✦ AI reads your direction, not judges it" hint

#### Screen 4 — ID Verification (Step 3 of 4)
- Upload CNIC front + back (dashed pink border box)
- "Under review — usually within 24 hours" status badge
- Trust indicators: Private · Admin-only · Never shared
- Optional wali email field

#### Screen 5 — Discover Feed
- Top bar: logo + search + bell + avatar
- 3 floating stat cards (top match %, active matches, views)
- "Today's matches" + "AI-scored" chip
- Match cards (glass, scrollable):
  - Avatar + name + city + age
  - Purpose quote (italic, pink border)
  - Life-direction tags (pink pills)
  - Compatibility % bar (animated)
  - "Express Interest ♡" + "Skip" buttons
- Bottom tab bar (floating pill): Discover · Messages · Profile · Purpose

#### Screen 6 — Match Detail
- Full-width gradient header with avatar
- Profile info: name, age, city, sect, education, profession
- Full purpose statement in glass card
- AI-generated compatibility summary
- 5 compatibility bars (animated on load)
- Tags row
- "Verified ✓" badge
- Wali toggle: "Include guardian in conversation"
- "Express Mutual Interest" CTA

#### Screen 7 — Chat
- Top bar: back arrow + avatar + name + "Verified ✓ · 94% match" + video icon
- Covenant banner: "♡ Both expressed interest — keep this purposeful"
- Chat bubbles:
  - Sent: gradient pink, right-aligned
  - Received: glass white, left-aligned
- Conversation starters (scrollable chips)
- Glass input bar + gradient send button

#### Screen 8 — Profile (Own)
- Avatar + name + edit button
- Profile completeness ring (% filled)
- Purpose statement preview
- Priority weights visualization
- Verification status badge
- Settings: notifications, wali email, privacy, logout

### Web Admin Panel Screens

#### Admin Screen 1 — Dashboard
- Stats row: Total users, Verified today, Active matches, Pending reviews
- Recent activity feed
- Quick actions

#### Admin Screen 2 — Verifications Queue
- Table: Name · City · Submitted · Status · Action
- "Review" opens modal with CNIC images
- Approve / Reject with note
- Bulk actions

#### Admin Screen 3 — User Management
- Search + filter (city, gender, status)
- Table with suspend/unsuspend actions
- Click user → full profile view

#### Admin Screen 4 — Reports
- Flagged conversations list
- Report details modal
- Action: warn / suspend / dismiss

---

## 9. FOLDER STRUCTURE

### Mobile App
```
/mithaq-app
  /src
    /features
      /auth         (authSlice, LoginScreen, RegisterScreen)
      /profile      (profileSlice, ProfileScreen, PurposeSetup)
      /matching     (matchSlice, DiscoverFeed, MatchDetail)
      /chat         (chatSlice, ChatScreen, ConversationList)
      /verification (VerificationScreen)
    /components
      /ui           (GlassCard, GradientButton, PinkPill, AvatarCircle)
      /layout       (BottomTabBar, TopBar, MeshBackground)
      /3d           (ThreeCanvas, FloatingObjects, ParticleField)
    /hooks          (useAuth, useMatch, useSocket, useEmbedding)
    /store          (store.js, rootReducer)
    /navigation     (AppNavigator, AuthNavigator, TabNavigator)
    /services       (api.js, socket.js, openai.js)
    /utils          (colors.js, animations.js, helpers.js)
    /constants      (routes.js, config.js)
```

### Backend
```
/mithaq-api
  /src
    /routes         (auth, profile, matches, chat, admin, verification)
    /controllers    (authController, profileController, etc.)
    /services       (matchingService, embeddingService, notificationService)
    /models         (User, Profile, Match, Message, Conversation, VerificationDoc)
    /middleware     (auth.js, adminOnly.js, upload.js, rateLimiter.js)
    /socket         (chatHandler, matchHandler)
    /utils          (jwt.js, bcrypt.js, embeddings.js)
    /config         (database.js, openai.js, multer.js)
  server.js
  .env
```

### Admin Panel
```
/mithaq-admin
  /src
    /pages          (Dashboard, Verifications, Users, Reports)
    /components     (Sidebar, StatsCard, UserTable, ReviewModal)
    /services       (adminApi.js)
```

---

## 10. ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mithaq
DB_NAME=mithaq
DB_USER=
DB_PASS=
DB_HOST=localhost
DB_PORT=5432

# Auth
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=

# OpenAI
OPENAI_API_KEY=sk-...

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5mb

# App
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

---

## 11. REDUX SLICES

### authSlice
```js
state: {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}
actions: login, logout, register, setUser
```

### profileSlice
```js
state: {
  profile: null,
  completeness: 0,
  isLoading: false
}
actions: setProfile, updatePurpose, updatePriorities
```

### matchSlice
```js
state: {
  feed: [],
  mutual: [],
  currentMatch: null,
  isLoading: false
}
actions: setFeed, expressInterest, skipMatch, setMutual
```

### chatSlice
```js
state: {
  conversations: [],
  activeConversation: null,
  messages: [],
  typingUsers: {}
}
actions: setConversations, setMessages, addMessage, setTyping
```

### uiSlice
```js
state: {
  activeScreen: 'discover',
  modals: {},
  notifications: []
}
```

---

## 12. MONETIZATION

### Free tier
- Create profile
- Get 1 match
- Express interest in 1 person
- See if they liked you back (blurred)

### Premium (after 1st match)
- Unlimited matches
- See who liked you (unblurred)
- Priority placement in feeds
- Read receipts in chat
- "Super Interest" feature (highlights your profile)

### Pricing
- Pakistan: Rs 799/month or Rs 1,999/3 months
- Diaspora (UK/US/CA): $9.99/month or $24.99/3 months

---

## 13. PHASE ROADMAP

### Phase 0 — Foundation (2–4 weeks)
- [ ] Project setup (Vite + React + Tailwind + Shadcn)
- [ ] Express server + PostgreSQL + Sequelize models
- [ ] Auth system (register, login, JWT)
- [ ] Basic profile CRUD
- [ ] CNIC upload flow
- [ ] Admin review queue (basic)

### Phase 1 — MVP (4–6 weeks)
- [ ] Purpose statement + OpenAI embeddings
- [ ] pgvector cosine similarity matching
- [ ] Match feed with compat scores
- [ ] Mutual interest gate
- [ ] Socket.io real-time chat
- [ ] Wali CC option
- [ ] Mobile UI (all 8 screens)
- [ ] Admin panel (verifications + user management)
- [ ] Launch to 200 users (invite only, Pakistan)

### Phase 2 — Monetize (6–10 weeks)
- [ ] Freemium paywall (after 1 match)
- [ ] Payment integration (JazzCash/EasyPaisa for PK, Stripe for diaspora)
- [ ] Premium features
- [ ] Purpose tag system (structured + AI-generated)
- [ ] Match explanation (LLM-generated "why you matched")
- [ ] Profile visibility controls
- [ ] Family share PDF

### Phase 3 — Scale (3–6 months)
- [ ] Compatibility engine v2 (feedback loop)
- [ ] Async video intro on profiles
- [ ] Scholar/imam vouching system
- [ ] Global localisation (Urdu, Arabic, Malay)
- [ ] iOS + Android app store launch

---

## 14. INSTRUCTIONS FOR CLAUDE CODE

You are building Mithaq (مِيثَاق), a Muslim matrimonial platform.
The prototype is already done. You are now building the production version.

Start with Phase 0:

1. Set up the monorepo structure with three packages:
   - mithaq-app (Vite + React + Tailwind + Shadcn)
   - mithaq-api (Express + Sequelize + PostgreSQL)
   - mithaq-admin (Vite + React + Tailwind)

2. Build the backend first:
   - All Sequelize models with associations
   - Auth routes with JWT
   - Profile routes
   - Verification upload with Multer
   - Socket.io setup on the same server

3. Then build the frontend:
   - Redux store with all slices
   - Implement screens in this order:
     Register → Purpose Setup → Verification → Discover Feed → Chat
   - Use the design system colors and glassmorphism style defined above
   - Every screen has the animated gradient mesh background
   - All animations use cubic-bezier(0.34, 1.56, 0.64, 1) spring easing

4. Admin panel last:
   - Dashboard with stats
   - Verification review queue
   - User management

Design rules to follow strictly:
- Background: ALWAYS the animated gradient mesh (#fff5f7 base + blurred orbs)
- Cards: ALWAYS glassmorphism (backdrop-filter blur + white/65 bg)
- Buttons: ALWAYS gradient (#f0134d → #fb7185), never flat
- Animations: stagger children in on screen mount, spring easing
- Spacing: minimum 24px padding, 16px gaps — NEVER crowded
- No flat white backgrounds. No sharp corners. No static elements.
```
