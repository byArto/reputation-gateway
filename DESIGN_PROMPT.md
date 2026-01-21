# Reputation Gateway - Design System & Project Context

## 📋 Project Overview

**Reputation Gateway** - это SaaS платформа для фильтрации beta-тестировщиков по их on-chain репутации через Ethos Network.

### Как это работает:
1. **Проект создает Access Page** с критериями отбора (минимальный score, vouches, reviews, возраст аккаунта)
2. **Тестировщики подключают wallet** и проходят автоматическую проверку через Ethos API
3. **Система генерирует одноразовые токены** для прошедших проверку
4. **Проект видит dashboard** со статистикой и списком заявок

---

## 🎨 Current Design System

### Colors
```css
/* Main Colors */
--background: #EFE9DF         /* Теплый бежевый фон */
--foreground: #1A1A1A         /* Почти черный текст */
--primary: #1E3A5F            /* Темно-синий (кнопки, акценты) */
--secondary: #5C5C5C          /* Серый (описания) */
--muted: #888888              /* Светло-серый (мета-информация) */
--border: #E5E0D8             /* Границы карточек */

/* Status Colors */
--success: #22C55E            /* Зеленый (eligible) */
--error: #EF4444              /* Красный (rejected) */
--warning: #F59E0B            /* Оранжевый (pending) */
```

### Typography
```javascript
// Fonts
font-serif: Playfair Display  // Заголовки (h1, h2)
font-sans: Inter              // Основной текст, кнопки, UI

// Type Scale
text-5xl  (48px) - Main headings (Landing hero, Result pages)
text-3xl  (30px) - Section headings (Dashboard title)
text-xl   (20px) - Subheadings
text-base (16px) - Body text, buttons
text-sm   (14px) - Labels, meta info
text-xs   (12px) - Timestamps, disclaimers
```

### Components Style

**Cards:**
- Background: `bg-white`
- Border: `border border-[#E5E0D8]`
- Border radius: `rounded-xl` (12px) or `rounded-3xl` (24px для больших)
- Shadow: `shadow-sm` или custom `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06)`
- Padding: `p-8` to `p-14` (зависит от размера)

**Buttons:**
- Primary: `bg-[#1E3A5F] text-white rounded-lg px-9 py-4`
- Secondary: `border-2 border-[#1E3A5F] text-[#1E3A5F] bg-transparent`
- Hover: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`

**Animations:**
- Fade in: `animate-in fade-in duration-500`
- Slide in: `slide-in-from-top-4`
- Zoom in: `zoom-in-95`

---

## 📁 Project Structure

```
app/
├── page.tsx                    # Landing page (/)
├── create/page.tsx            # Create project (/create)
├── [slug]/page.tsx            # Tester view (/:slug)
├── [slug]/result/page.tsx     # Result page (/:slug/result)
├── dashboard/[slug]/page.tsx  # Dashboard (/dashboard/:slug)
└── api/                       # API routes

components/
├── landing-hero.tsx           # Landing hero section
├── filter-cards.tsx           # Filter preset cards
├── create-page-form.tsx       # Project creation form
├── tester-view.tsx            # Wallet connect + validation
├── result-eligible.tsx        # Eligible result screen
├── result-not-eligible.tsx    # Rejected result screen
├── dashboard-stats.tsx        # Dashboard statistics
└── application-card.tsx       # Application list item

lib/
├── db.ts                      # Database queries
├── ethos.ts                   # Ethos Network API
├── invite-tokens.ts           # Token generation/validation
├── validation.ts              # Criteria validation
├── filters.ts                 # Filter presets
└── session.ts                 # Session management
```

---

## 📄 Pages to Redesign

### 1. Landing Page (`app/page.tsx`)
**Current structure:**
- Hero section with badge "Powered by Ethos Network"
- Main heading: "Filter Beta Testers by Reputation"
- Subtitle with value proposition
- CTA button: "Create Access Page"
- Stats: 1,200+ Projects, 500K+ Verified Profiles, 99% Accuracy

**Current code:** `components/landing-hero.tsx`

---

### 2. Create Project Page (`app/create/page.tsx`)
**Current flow:**
1. **Filter Cards Section** - выбор пресета (Standard/Strict/Custom)
2. **Form Section** - настройка критериев и создание проекта

**Components:**
- `components/filter-cards.tsx` - карточки с пресетами
- `components/create-page-form.tsx` - форма создания

**Filter Presets:**
```typescript
{
  standard: {
    minScore: 200,
    minVouches: 1,
    positiveReviews: true,
    minAccountAge: 30
  },
  strict: {
    minScore: 500,
    minVouches: 3,
    positiveReviews: true,
    minAccountAge: 90
  },
  custom: { user defined }
}
```

---

### 3. Tester View (`app/[slug]/page.tsx`)
**Current flow:**
1. Показывает project name и description
2. Кнопка "Connect Wallet" (Privy)
3. После подключения → валидация через Ethos API
4. Редирект на result page

**Component:** `components/tester-view.tsx`

---

### 4. Result Pages (`app/[slug]/result/page.tsx`)

#### A. Eligible Screen (`components/result-eligible.tsx`)
**Current structure:**
- Green checkmark icon
- Heading: "You're Eligible!"
- Score badge (круглый)
- Description
- Green panel с детальными requirements (Score, Vouches, Reviews, Account Age)
- Button: "Join Discord" / "Access Website"
- Token expiration notice
- Link to Ethos Network

#### B. Not Eligible Screen (`components/result-not-eligible.tsx`)
**Current structure:**
- Red X icon
- Heading: "Not Eligible"
- Red panel с failed requirements (checkmarks/x marks)
- How to improve section (bullet points)
- Button: "Learn About Ethos Network"
- Reapply timer

---

### 5. Dashboard (`app/dashboard/[slug]/page.tsx`)
**Current structure:**
- **Stats Section:** Total apps, Last 24h, Accepted %, Rejected %, Avg score
- **Page URL Section:** Shareable link с кнопкой Copy
- **Applications List:** Cards с информацией о каждой заявке

**Components:**
- `components/dashboard-stats.tsx` - статистика
- `components/application-card.tsx` - карточка заявки

**Application Card fields:**
- Username (from Ethos)
- Score badge
- Status (accepted/rejected/pending)
- Timestamp (relative time)
- Link to Ethos profile
- Actions (Approve/Reject) для pending

---

## 🔧 Tech Stack

```json
{
  "framework": "Next.js 16 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS 4",
  "fonts": "Google Fonts (Playfair Display + Inter)",
  "icons": "lucide-react",
  "auth": "@privy-io/react-auth",
  "database": "@vercel/postgres (Neon)",
  "api": "Ethos Network API"
}
```

---

## 🎯 Design Principles

1. **Clean & Minimal** - избегать визуального шума
2. **Trust Signals** - показывать надежность (Ethos badge, stats)
3. **Clear Hierarchy** - serif заголовки + sans текст
4. **Smooth Interactions** - transitions, hover effects, animations
5. **Status Clarity** - четкие цвета для статусов (green/red/orange)
6. **Mobile Friendly** - responsive design (sm/md/lg breakpoints)

---

## 📝 Content Tone

- **Professional but approachable** (не corporate, не casual)
- **Benefit-focused** ("Stop wasting time on low-quality testers")
- **Data-driven** (показывать цифры: scores, stats, metrics)
- **Action-oriented** (clear CTAs: "Create Access Page", "Join Discord")

---

## 🚀 Key Features to Highlight

1. **One-time-use tokens** - безопасность (URLs не могут быть расшарены)
2. **Ethos Network integration** - on-chain reputation
3. **Automatic validation** - нет ручной проверки
4. **Real-time dashboard** - статистика по заявкам
5. **Flexible criteria** - настраиваемые фильтры
6. **24-hour token expiration** - контроль доступа

---

## 📊 Example Data (for mockups)

**Project Example:**
```
Name: "DefiSwap Beta Program"
Slug: "defiswap-beta"
Criteria: Score 300+, 2 vouches, positive reviews, 60 days
Destination: Discord invite
```

**User Examples:**
```
✅ Eligible User:
   Username: "vitalik.eth"
   Score: 850
   Vouches: 5
   Reviews: 12 positive, 1 negative
   Account Age: 180 days

❌ Not Eligible User:
   Username: "newbie.eth"
   Score: 150
   Vouches: 0
   Reviews: 0 positive, 0 negative
   Account Age: 5 days
```

**Dashboard Stats:**
```
Total Applications: 247
Last 24h: 18
Accepted: 156 (63%)
Rejected: 91 (37%)
Avg Score: 420
Avg Accepted Score: 580
```

---

## 🎨 What You Need to Do

1. **Analyze current design** (я отправлю код текущей страницы)
2. **Propose visual improvements:**
   - Better layout/spacing
   - Enhanced visual hierarchy
   - Improved component design
   - Better use of color/typography
   - Added visual elements (illustrations, icons, patterns)
   - Enhanced micro-interactions

3. **Provide complete code** for the redesigned page:
   - Full TypeScript/React component
   - Tailwind CSS classes
   - lucide-react icons (if needed)
   - Responsive design
   - Animations/transitions
   - Same functionality (не менять логику)

4. **Keep consistent with:**
   - Existing color palette
   - Font choices (Playfair + Inter)
   - Component patterns
   - Overall project style

---

## 📤 Deliverable Format

```typescript
// Full component code with:
// 1. All imports
// 2. Type definitions
// 3. Component logic (keep existing)
// 4. Enhanced JSX with new design
// 5. Comments explaining key design decisions
```

---

## ✅ Ready to Start

Я буду присылать тебе код каждой страницы по очереди. Ты анализируешь текущий дизайн и предлагаешь улучшенную версию с полным кодом.

**Первая страница для редизайна:** Dashboard (`app/dashboard/[slug]/page.tsx`)

Жду твоих предложений! 🚀
