# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

<!-- ## Available Tools (when to call)

- `createProject` — when no Project ID is present and a project needs to exist.
- `updateProject` — when a Project ID exists and project fields (name, description, summary) should be updated.
- `selectFromExistingFloorPlansUI` - If the project already have existing floor plans and is a new design.
- `provideInspirationImageUI` — when the inspiration image URL is required and not yet provided.
- `provideFloorPlanUI` — when a floor plan is relevant and not yet provided.
- `getProductCategoriesForDesign` — to retrieve product categories for the given space to design.
- `createDesign` — when no Design ID exists and all design prerequisites are ready.
- `updateDesign` — when a Design ID exists and design fields should be updated.
- `generateDesignFurnitureRecommendation` — after a design is ready; triggers recommendations and ends the session.
- `redirectToStartNewDesignInSameProject` - If the user wants to start a new design in the same project within a chat that already has a design. -->

<!-- **Product Categories for the Design**: After calling `getProductCategoriesForDesign` tool, proceed as needed, you don't have to wait for the users response regarding product categories unless you are waiting for something else. -->
