## Overview
Channels is a calm, productivity-first interface for mobile-native and mobile-web usage.
The visual language is neutral and structured, with grayscale-first surfaces, clear hierarchy, and minimal decorative color.
The UI should feel lightweight, practical, and consistent across light and dark mode.

## Colors
- **Primary** (`#D6D6D6` light / `#BDBDBD` dark): Primary CTA backgrounds and selected high-priority controls (`ui.button.primary.bg`)
- **Secondary** (`#F7F7F7` light / `#505050` dark): Panels, sheet headers, secondary interactive containers (`role.surface.panel`, `ui.button.secondary.bg`)
- **Tertiary** (`#E5E5E5` light / `#9F9F9F` dark): Subtle surfaces, chips, separators, low-emphasis containers (`role.surface.subtle`)
- **Neutral** (`#1F1F1F` light / `#F7F7F7` dark): Primary text and high-contrast content (`role.text.primary`)

Status and utility colors:
- **Success** (`#35CB72` light / `#4ADE80` dark)
- **Warning** (`#F59E0B` light / `#FBBF24` dark)
- **Error** (`#ED4044` light / `#F87171` dark)
- **Info** (`#5C9FA3` light / `#7DD3FC` dark)
- **Social Accent** (`#FEE500`): Kakao brand action only (`social.kakao.yellow`)

## Typography
- **Headline Font**: Spoqa Han Sans (semiBold or bold)
- **Body Font**: Spoqa Han Sans (regular)
- **Label Font**: Spoqa Han Sans (medium)

Type scale is compact and mobile-optimized.
- Common body sizes: 13px to 16px (`text-size13` to `text-size16`)
- Supporting text: 11px to 12px (`text-size11`, `text-size12`)
- Titles and key labels: 15px to 18px (`text-size15` to `text-size18`)

## Elevation
This system is mostly flat.
Depth is primarily expressed using surface tone differences, not heavy shadow stacking.

Shadow usage is limited to floating or transient elements:
- `shadow_100`: soft modal/switch container emphasis
- `shadow_500`: small floating controls
- `shadow_700`: rare strong emphasis

Cards and form blocks generally rely on border and tone contrast instead of high elevation.

## Components
- **Buttons**: Rounded corners (`radius15`), primary uses `ui.button.primary.*`, secondary uses `ui.button.secondary.*`, choice states use `ui.button.choice.*`
- **Inputs**: Use filled panel/card background (`ui.input.default.bg`), clear text contrast, 1px semantic border, focus border from `ui.input.focus.border`
- **Cards/Sheets**: Panel/card surfaces (`role.surface.panel` / `role.surface.card`) with rounded corners (`radius10` or `radius15`)
- **Chips/Selectors**: Selected/unselected states should come from semantic choice tokens, not hardcoded color
- **Text**: Use `SpoqaText` as default text component, maintain semantic text hierarchy (`role.text.primary/secondary/tertiary`)

## Do's and Don'ts
- Do use semantic tokens (`role.*`, `ui.*`, `domain.*`) instead of hardcoded hex colors.
- Do provide both light and dark variants for every generated screen.
- Do keep corner radius consistent (`radius10`, `radius15`, `circle`) within the same view.
- Do keep visual density practical for mobile task flows.
- Don't introduce saturated accent colors for primary UI structure.
- Don't mix unrelated elevation styles in one screen.
- Don't use more than two font weights in a single compact content block.
- Don't bypass semantic status colors for success/warning/error/info communication.

## Reference

Format: token | purpose | mapped value | usage(count:example)

### role
- role.surface.canvas | base bg | #FFFFFF/#3A3A3A | 15:alarm-pickers-row.tsx
- role.surface.panel | panel/sheet | #F7F7F7/#505050 | 17:alarm-sheet.tsx
- role.surface.card | card/input | #F1F1F1/#747474 | 1:follow-request-item.tsx
- role.surface.subtle | subtle area | #E5E5E5/#9F9F9F | 3:animated-switch.tsx
- role.surface.muted | muted emphasis | #D6D6D6/#BDBDBD | 5:animated-switch.tsx
- role.surface.choiceSelected | choice sel | #E5E5E5/#505050 | 0
- role.surface.choiceUnselected | choice unsel | #FFFFFF/#9F9F9F | 0
- role.surface.inverse | inverse surface | #1F1F1F/#FFFFFF | 2:motion-pressable.tsx
- role.text.primary | primary text | #1F1F1F/#F7F7F7 | 16:alarm-sheet.tsx
- role.text.secondary | secondary text | #505050/#E5E5E5 | 4:date-input-set.tsx
- role.text.tertiary | tertiary text | #747474/#D6D6D6 | 6:main-tab-bar.tsx
- role.text.inverse | inverse text | #FFFFFF/#1F1F1F | 13:alert-modal.tsx
- role.text.invalid | invalid text | #ED4044/#F87171 | 0
- role.border.default | default border | #D6D6D6/#9F9F9F | 3:bottom-sheet.tsx
- role.border.subtle | subtle border | #E5E5E5/#747474 | 2:radio-item.tsx
- role.border.strong | strong/focus border | #9F9F9F/#D6D6D6 | 2:select-option.tsx
- role.icon.default | default icon | #1F1F1F/#F1F1F1 | 3:empty-list.tsx
- role.icon.muted | muted icon | #9F9F9F/#D6D6D6 | 2:shaking-check-icon.tsx
- role.icon.inverse | inverse icon | #FFFFFF/#1F1F1F | 2:form-header.tsx
- role.icon.checkboxCheck | checkbox checked | #000000/#000000 | 0
- role.icon.checkboxUncheck | checkbox unchecked | #8A8A8A/#8A8A8A | 0
- role.status.success | success | #35CB72/#4ADE80 | 1:todo-time-sheet.tsx
- role.status.warning | warning | #F59E0B/#FBBF24 | 0
- role.status.error | error | #ED4044/#F87171 | 4:form-text-input.tsx
- role.status.info | info | #5C9FA3/#7DD3FC | 0

### ui
- ui.button.primary.bg | primary btn bg | role.surface.muted(#D6D6D6/#BDBDBD) | 9:alert-modal.tsx
- ui.button.primary.text | primary btn text | role.text.primary(#1F1F1F/#F7F7F7) | 0
- ui.button.primary.border | primary btn border | role.border.default(#D6D6D6/#9F9F9F) | 0
- ui.button.secondary.bg | secondary btn bg | role.surface.panel(#F7F7F7/#505050) | 0
- ui.button.secondary.text | secondary btn text | role.text.secondary(#505050/#E5E5E5) | 0
- ui.button.secondary.border | secondary btn border | role.border.default(#D6D6D6/#9F9F9F) | 0
- ui.button.choice.selected.bg | choice sel bg | role.surface.choiceSelected(#E5E5E5/#505050) | 1:select-chip.tsx
- ui.button.choice.selected.text | choice sel text | role.text.primary(#1F1F1F/#F7F7F7) | 0
- ui.button.choice.selected.border | choice sel border | role.border.default(#D6D6D6/#9F9F9F) | 1:select-chip.tsx
- ui.button.choice.unselected.bg | choice unsel bg | role.surface.choiceUnselected(#FFFFFF/#9F9F9F) | 1:select-chip.tsx
- ui.button.choice.unselected.text | choice unsel text | role.text.primary(#1F1F1F/#F7F7F7) | 0
- ui.button.choice.unselected.border | choice unsel border | role.border.default(#D6D6D6/#9F9F9F) | 0
- ui.arrow.bg | arrow bg | role.surface.subtle(#E5E5E5/#9F9F9F) | 1:custom-calendar.tsx
- ui.arrow.icon | arrow icon | role.icon.default(#1F1F1F/#F1F1F1) | 2:bottom-multiple-calendar.tsx
- ui.arrow.border | arrow border | role.border.default(#D6D6D6/#9F9F9F) | 0
- ui.header.bg | header bg | role.surface.panel(#F7F7F7/#505050) | 0
- ui.header.text | header text | role.text.primary(#1F1F1F/#F7F7F7) | 0
- ui.icon.default | default ui icon | role.icon.default(#1F1F1F/#F1F1F1) | 4:alarm-sheet.tsx
- ui.icon.muted | muted ui icon | role.icon.muted(#9F9F9F/#D6D6D6) | 1:main-tab-bar.tsx
- ui.icon.inverse | inverse ui icon | role.icon.inverse(#FFFFFF/#1F1F1F) | 0
- ui.checkbox.check | checkbox check | role.icon.checkboxCheck(#000000/#000000) | 0
- ui.checkbox.uncheck | checkbox uncheck | role.icon.checkboxUncheck(#8A8A8A/#8A8A8A) | 0
- ui.input.default.bg | input bg | role.surface.card(#F1F1F1/#747474) | 1:text-input.tsx
- ui.input.default.text | input text | role.text.primary(#1F1F1F/#F7F7F7) | 1:text-input.tsx
- ui.input.default.placeholder | input placeholder | role.text.secondary(#505050/#E5E5E5) | 1:text-input.tsx
- ui.input.default.border | input border | role.border.default(#D6D6D6/#9F9F9F) | 1:text-input.tsx
- ui.input.focus.border | input focus border | role.border.strong(#9F9F9F/#D6D6D6) | 1:text-input.tsx
- ui.card.default.bg | card bg | role.surface.card(#F1F1F1/#747474) | 0
- ui.card.default.border | card border | role.border.default(#D6D6D6/#9F9F9F) | 0

### domain
- domain.feed.headerBg | feed header bg | role.surface.card(#F1F1F1/#747474) | 0
- domain.stats.badgeBg | stats badge bg | role.surface.panel(#F7F7F7/#505050) | 0

> scope: components/**/*.tsx
