# Design Token Inventory (2026-04-04)

## 1) Current Token System Snapshot
- Source of truth: `constants/theme/colors.ts`
- Tailwind bridge: `tailwind.config.ts` via `createTailwindColorTokens()`
- Runtime resolver: `hooks/use-theme-color/use-theme-color.ts`
- Current namespaces:
  - `neutral.*`
  - `role.surface|text|border|icon|status.*`
  - `ui.button|arrow|header|icon|checkbox|input|card.*`
  - `domain.feed.headerBg`, `domain.stats.badgeBg`
  - `social.kakao.yellow`
  - `palette.colorSheet.*`

## 2) Screen-Level Inventory
- Feed
  - Main container and calendar mostly use `role.*` and `ui.icon.*`
  - Domain token usage is limited (`domain.feed.headerBg` exists but not broadly consumed)
- Goal
  - Form/editor pages mostly use `role.surface.*`, `role.text.*`
  - Repeat management has partial hardcoded action colors
- Stats
  - Core cards/charts use `role.*`
  - Report delta badges and calendar dots include hardcoded semantic colors
- Settings/Notification/Announcement
  - Largely tokenized with `role.*`, `ui.button.*`, `ui.icon.*`

## 3) Component-Level Inventory
- Well-tokenized common components
  - `components/text-input/*`, `components/button/*`, `components/select-chip/*`, `components/page-header/*`, `components/toast/*`
- Mixed token/hardcoded components
  - `features/repeat-todo/components/swipeable-repeat-todo-card/*`
  - `features/todo/components/todo-reminder-list-box/*`
  - `features/stats/components/stats-report-card/*`
  - `components/privacy-sheet/components/sheet-radio-item/*`
  - `features/auth/components/kakao-login-button/*`

## 4) Hardcoded Color Hotspots (Priority)
### P1 (brand/semantic impact high)
- `features/stats/components/stats-report-card/stats-report-card.tsx`
  - `#E7F3EB`, `#F6E8E8`, `#ECECEC`, `#2F6B45`, `#8A5555`, `#7A7A7A`
- `features/stats/components/stats-goal-detail-screen/components/calendar-stats-section/calendar-stats-section.tsx`
  - `#00C73C`, `#ED4044`
- `components/privacy-sheet/components/sheet-radio-item/sheet-radio-item.tsx`
  - `#1363de`, `#ccc`
- `features/repeat-todo/components/swipeable-repeat-todo-card/swipeable-repeat-todo-card.tsx`
  - `#FFD9D9`, `#D54646`, `#B5B5B5`

### P2 (functional but visually noticeable)
- `features/todo/components/todo-reminder-list-box/todo-reminder-list-box.tsx`
  - `#FFD9D9`, `#D54646`, `#303030`, `#8A8A8A`
- `features/auth/components/kakao-login-button/kakao-login-button.tsx`
  - `#FEE500`, `#000000D9`
- `components/todo-sheet/components/todo-action-grid/todo-action-grid.tsx`
  - `#FDB541`

### P3 (fallback/default tuning)
- `components/toast/components/toast-item/hooks/use-toast-type-color/use-toast-type-color.ts`
  - `#FB923C`, `#86EFAC`, `#F59E0B`, `#EF4444`
- `components/timeline/components/line-box/line-box.tsx`
  - fallback `#D9D9D9`

## 5) Proposed Token Expansion (Brand Decision Ready)
- `role.brand.*`
  - `role.brand.primary`, `role.brand.primaryHover`, `role.brand.primarySubtle`, `role.brand.onPrimary`
- `role.action.*`
  - `role.action.danger.bg`, `role.action.danger.text`, `role.action.warning.bg`, `role.action.warning.text`
- `role.chart.*`
  - `role.chart.positive.bg`, `role.chart.positive.text`
  - `role.chart.negative.bg`, `role.chart.negative.text`
  - `role.chart.neutral.bg`, `role.chart.neutral.text`
- `role.calendar.*`
  - `role.calendar.achievedDot`, `role.calendar.postponedDot`
- `ui.interactive.*`
  - `ui.interactive.selected.border`, `ui.interactive.selected.fill`
- `domain.auth.*`
  - `domain.auth.kakao.bg`, `domain.auth.kakao.text`

## 6) Migration Mapping (Representative)
- `#FFD9D9` -> `role.action.danger.bg`
- `#D54646` -> `role.action.danger.text`
- `#00C73C` -> `role.calendar.achievedDot`
- `#ED4044` -> `role.calendar.postponedDot`
- `#E7F3EB` -> `role.chart.positive.bg`
- `#2F6B45` -> `role.chart.positive.text`
- `#F6E8E8` -> `role.chart.negative.bg`
- `#8A5555` -> `role.chart.negative.text`
- `#ECECEC` -> `role.chart.neutral.bg`
- `#7A7A7A` -> `role.chart.neutral.text`
- `#1363de` -> `ui.interactive.selected.fill`
- `#ccc` -> `role.border.default`
- `#FEE500` -> `domain.auth.kakao.bg`
- `#000000D9` -> `domain.auth.kakao.text`
