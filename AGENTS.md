# Project Description

- The application will be served on Native and Web using Expo and Expo Web.
- Routing is done by Expo-Router.
- MS Edge is the primary browser for QA.
- Mobile Native App and Mobile Web App are the primary objective platforms.

## Team routing rules

Treat requests addressed to the "team" as coordinated multi-agent work.

The default leading coordinator is `organizing-instructor`.

Interpret user instructions flexibly in either Korean or English.
A request does not need to use exact agent names if the intent is clear.

When a team request is detected:

1. `organizing-instructor` coordinates the work.
2. Relevant subagents may be spawned to work as needed.

## Conventions

- Encoding is UTF-8.
- EOL Sequence is currently CRLF, but LF should be gradually applied as migration to macOS/Linux is planned.
- NativeWind applied: Styles to be in the class name as Tailwind style, except for Reanimated library components (Animated.View, etc.)
  - Reanimated is not compatible with NativeWind. Stylesheet should be applied for the Reanimated Components from `react-native-reanimated`
- Directory and file name: kebab-case
- Functional component name: PascalCase.
- functionName should start with `handle` instead of `on`.
- Barrel needs to be applied for non-single component structure.
  - Barrel example below)

```
root (non-single)
- child1 (single)
  - child1.tsx
- child2 (single)
  - child2.tsx
- child3 (single)
  - child3.tsx
- index.ts
```

- Naming of page functionnal component under `app` should be the same as the page file name.
  - Example: `feed.tsx` should only have and export `Feed()`.
- If the page under `app` is `index.tsx`, the component should have the name of the directory.
  - Example: `/feed/index.tsx` should only have and export `Feed()`.
- Common components which can be used in the multiple pages or components should be placed under `components`.
- Common hooks which can be used in the multiple pages or components should be placed under `hooks`.
- Components and hooks which would only be used internally for a certain page should be placed under `features/<page>/components or hooks`.
- Components and hooks which would only be used internally for a certain component should be placed under the directory of that certain component.

## State and Hook

- Hook must exist for state control instead of the direct control of the state in the component.
- For global state, zustand should be used under `/stores` of the root.

### State Control Example

```typescript
// component.tsx
function Component() {
  const { data1, data2, callback } = useComponentState();
}

// use-component-state.ts
function useComponentState() {
  const [data1, setData1] = useState();
  const [data2, setData2] = useState();

  function callback() {
    setData1();
    setData2();
  }

  return {
    data1,
    data2,
    callback(),
  };
}
```

## Font

- Instead of <Text> component, use <SpoqaText> as a default from the components/spoqa-text.

## Custom Animation

- OutsidePressBackdrop has been added in `components/outside-press-backdrop` to imitate the outside click of the DOM element.
- To imitate the AnimatePresence of the framer-motion, MotionView is added in `components/motion/motion-view`.
- For Button (Pressable) with animation, MotionPressable in `components/motion/motion-pressable` can be used.

## Data Fetching

- Server API request and response type should be placed under `types`.
- Server API fetching for certain domain should be placed under `service/<domain or page>` and should be implemented using `fetchApi()` from `api`.
- API endpoints will be given for every instruction if needed, and should be placed under `constants/end-points/<domain>`.
- Query Key should be manged in the `constants/query-key/query-key.ts`.
- Tanstack Query and mutation can be happened in the component or page where the tanstack query is necessary.

## Input

- React Native Text Input cannot be used directly as it has a problem with Korean.
- `components/text-input/text-input.tsx` should be used for TextInput whenever if necessary.

## Debugging or QA for Expo Web

- To debug or QA with actual brower, first check if the local server(http://localhost:8080) is alive.
- if local server is alive, run `bun start:web`. if not, run `bun start:web:dev` to refresh Metro cache.
- After refreshing Metro cache, run static resources by the script `bun serve`(local server alive) or `bun serve:dev` for faster QA.
- URL is `http://localhost:8081`.
- choose "게스트 로그인" to avoid actual login for UI/UX QA.
- When new implementation or code change is applied, serve again to start the latest web app.
- preferred browser is MS Edge.