# DDUDU-DDUDU Project Description

- This project is to complete Expo(ReactNative) development of a TODO application which has fundamental add-on functions such as timeline, reminder, statistics, and so on.
- The application will be served on Native and Web using Expo and Expo Web.

## Domains

- Domains are internal terms of this application which indicates the particular service of the application, and the details are the followings:
- User: User refers to the end-user of the application. Each user can only sign-in via SNS (Oauth2) login. To minimize the user's PII, the meaningful user data consists of only id and nickname. Nickname is automatically set when signed up, and can be edited.
- Ddudu: Basic TODO item. User has to set the date, and the time is optional. User can see the monthly overview of the ddudus in the main feed (/feed).
- Goal: Goal is a category which consists of a group of ddudus. User can create, edit, and terminate the goal, and the statistics are Goal-based stats showing the monthly status of ddudus under each goal.
- Repeat Ddudu: Repeat-ddudu is a ddudu item, sort of template, that is generated repeatably on the date and time pattern that the user set. Goal can have multiple repeat-ddudus.
- Reminder: Reminder of ddudu. When setting the reminder, user will only set the time before of the ddudu start time, like 1 hour before the ddudu start time, which means user can only set the reminders of ddudus which has the start time.
- Feed: feed is the monthly overview of the ddudus.
- Schedule: Schedule is the weekly overview of the ddudus which makes the timeline visible.
- Timeline: Timeline is the detailed view of the ddudus of the day. Following one vertical line, the ddudus are placed in ascending order of the start time.
- There may be other domains not written in this document, and can be told to be added.

## Environment and Library

- Expo with Metro bundler.
- Routing is done by Expo-Router.
- All the libraries can be found in the `package.json`

## Project Structure

- app: Expo Router is used, so all the pages should be placed under `app` directory.
  - tabs: under (tabs), there are mainly four directories for the sets of Stack Screens. Tabs are routing to the `_layout` of each set of Stack Screen where index is the main Stack screen.
    - feed: feed is a directory where index is the main feed stack screen.
- components: Reusable components should be placed under `components` directory.
- api: baseline hook for fetching to communicate with the REST API server.
- features: Components and hooks that are used in the specific page or domain.
- assets: static resources
- constants: all the meaningful, reusable constants such as API endpoints and Tanstack Query keys.
- hooks: Reusable hooks should be placed under `hooks` directory.
- icons: SVG icons.
- service: Fetching logics.
- types: API Request and Response types
- utils: util functions.

## Conventions

- Character Encoding should be UTF-8 (NO BOM).
- Since NativeWind is applied, all the styles are likely to be in the class name as Tailwind style, except for Reanimated components (Animated.View, etc.).
- Reanimated is not compatible with NativeWind, so React Native Stylesheet should be applied for the Reanimated Components starting with Reanimated.
- Directory and file name should be in kebab-case, while the functional component in the file should be named in PascalCase.
- functionName should start with `handle` instead of `on`.
- Barrel needs to be applied for almost every components and hooks.
- Naming of page functionnal component under `app` should be the same as the page file name. For example, `feed.tsx` should only have and export `Feed()`.
- If the page under `app` is `index.tsx`, the component should have the name of the directory. For example, `/feed/index.tsx` should only have and export `Feed()`.
- Prettier is the Formatter, and the rule that should be followed for the formatting is in the `.prettierrc`.
- Common components which can be used in the multiple pages or components should be placed under `components`.
- Common hooks which can be used in the multiple pages or components should be placed under `hooks`.
- Components and hooks which would only be used internally for a certain page should be placed under `features/<page>/components or hooks`.
- Components and hooks which would only be used internally for a certain component should be placed under the directory of that certain component.

## State and Hook

- In most cases, I prefer to have a hook for state control instead of the direct control of the state in the component so that I can divide the concern for the refactoring.
- If the component is extremely simple, up to a couple of states can be contolled in the component.
- For global state, zustand should be used under `/stores` of the root.

## Font

- Instead of <Text> component, use <SpoqaText> from the components/spoqa-text.

## Animation

- Reanimated v4 is in use.
- OutsidePressBackdrop has been added in `components/outside-press-backdrop` to imitate the outside click of the DOM element.
- To imitate the AnimatePresence of the framer-motion, MotionView is added in `components/motion/motion-view`.
- For Button (Pressable) with animation, MotionPressable in `components/motion/motion-pressable` can be used.

## Data Fetching

- Server API request and response type should be placed under `types`.
- Server API fetching for certain domain should be placed under `service/<domain or page>` and should be implemented using `fetchApi()` from `api`.
- API endpoints will be given for every instruction if needed, and should be placed under `constants/end-points/<domain>`.
- Query Key should be manged in the `constants/query-key/query-key.ts`.
- Tanstack Query and mutation can be happened in the component or page where the tanstack query is necessary.
