# Design Guidelines: Store Rating Platform

## Design Approach

**Selected System**: Modern SaaS Dashboard Design inspired by Linear, Stripe Dashboard, and Notion
**Justification**: This application is utility-focused with complex data tables, role-based dashboards, and information-dense interfaces requiring clarity and efficiency over visual flair.

## Core Design Principles

1. **Clarity & Hierarchy**: Clear visual separation between navigation, content areas, and actions
2. **Data Density**: Comfortable information display without overwhelming users
3. **Role-Based Consistency**: Each user role maintains consistent patterns while having distinct dashboard layouts
4. **Functional Aesthetics**: Clean, professional appearance that prioritizes usability

## Typography System

**Font Family**: Inter (Google Fonts) for all text - excellent readability for data-heavy interfaces

**Hierarchy**:
- Page Titles: text-3xl, font-semibold
- Section Headers: text-xl, font-semibold  
- Card/Component Titles: text-lg, font-medium
- Body Text: text-base, font-normal
- Labels/Captions: text-sm, font-medium
- Helper Text: text-xs, font-normal

## Layout System

**Spacing Scale**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-6
- Form field spacing: space-y-4

**Grid System**:
- Dashboard cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Data tables: Full width with responsive horizontal scroll
- Forms: Single column max-w-2xl for optimal readability

## Application Structure

### Authentication Pages (Login/Register)
**Layout**: Centered card layout on minimal background
- Card: max-w-md, p-8, rounded-lg, shadow-lg
- Logo/branding at top
- Form fields with clear labels above inputs
- Registration page includes role selector (dropdown or segmented control)
- Links to switch between login/register below primary action

### Main Application Layout
**Structure**: Sidebar + Main Content Area
- **Sidebar** (fixed, left): w-64, full height
  - Logo/branding at top (p-6)
  - Navigation items with icons (Heroicons)
  - User profile section at bottom
  - Active state: subtle background treatment, border accent
- **Main Content**: flex-1, overflow-y-auto
  - Top bar: sticky, contains page title, search (if applicable), user menu
  - Content area: p-8, max-w-7xl mx-auto

### Dashboard Components

**Stats Cards** (All Dashboards):
- Grid layout: 3 columns on desktop, stack on mobile
- Each card: p-6, rounded-lg, border
- Icon (Heroicons): Large, top-left or inline with metric
- Metric: text-3xl, font-bold
- Label: text-sm, opacity-70

**Data Tables**:
- Header: sticky, font-medium, text-sm, uppercase tracking-wide
- Rows: hover state, border-b, p-4
- Sortable columns: clickable header with sort icon (chevron)
- Actions column: right-aligned, icon buttons
- Filters: Top bar with input fields and dropdowns, flex gap-4
- Pagination: Bottom, centered, showing count + page controls

**Rating Display**:
- Star icons (Font Awesome): filled/outlined, inline-flex gap-1
- Overall rating: Larger stars (text-2xl) with numeric value
- User ratings: Standard size (text-lg) with edit capability
- Interactive rating input: Hoverable stars with pointer cursor

### Forms

**Input Fields**:
- Label above: text-sm, font-medium, mb-2
- Input: p-3, rounded-lg, border, w-full
- Validation errors: text-sm, text-red-600, mt-1
- Helper text: text-xs, opacity-70, mt-1

**Role Selector (Registration)**:
- Segmented control OR dropdown
- Three options: System Administrator, Normal User, Store Owner
- Clear visual indication of selected role
- Description text below each option (text-xs)

**Buttons**:
- Primary: px-6 py-3, rounded-lg, font-medium
- Secondary: px-6 py-3, rounded-lg, border, font-medium  
- Icon buttons: p-2, rounded-md (for table actions)
- Consistent hover/active states throughout

### Store Listing (Normal User View)

**Card Layout**: 
- Grid: 2 columns on desktop, single column on mobile
- Each store card: p-6, rounded-lg, border
- Store name: text-lg, font-semibold
- Address: text-sm, opacity-70, mt-1
- Rating display: Stars + numeric, mt-4
- User's submitted rating: Highlighted section
- Action button: "Rate" or "Update Rating" - full width, mt-4

**Search Bar**: 
- Top of page, max-w-2xl
- Two input fields side-by-side: Name and Address
- Search icon (Heroicons)

### Store Owner Dashboard

**User Rating List**:
- Table format with columns: User Name, Email, Rating, Date
- Average rating: Large display card at top (text-4xl for number)
- Filter/sort capabilities

## Icons

**Library**: Heroicons (via CDN)
**Usage**:
- Navigation: 24px icons with labels
- Stats cards: 32px icons
- Table actions: 20px icons
- Form inputs: 20px icons (prefix/suffix)
- Rating: Font Awesome stars for familiarity

## Component Patterns

**Modal/Dialog**: 
- Overlay: backdrop-blur with opacity
- Content: max-w-lg, p-8, rounded-lg, shadow-2xl
- Header with close button (top-right)
- Footer with action buttons (right-aligned)

**Empty States**:
- Centered content with icon (48px)
- Descriptive text: text-lg
- Call-to-action button below

**Loading States**:
- Skeleton screens for tables (animated pulse)
- Spinner for actions (inline with button text)

## Responsive Behavior

- Sidebar: Collapsible to icon-only on tablet, hidden with hamburger menu on mobile
- Tables: Horizontal scroll on mobile with sticky first column
- Dashboard cards: Stack to single column below md breakpoint
- Form layout: Full width on mobile with adjusted padding

## Animations

**Minimal Motion**:
- Page transitions: None or subtle fade (150ms)
- Hover states: Quick scale/opacity (100ms)
- Modal open/close: Fade + slight scale (200ms)
- Table row hover: Background color transition (150ms)

**No scroll-triggered animations** - focus on immediate responsiveness

This design creates a professional, data-focused interface that scales across all user roles while maintaining consistency and usability.