# Getting Started with Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

```bash
# Using pnpm
pnpm i vercel

# Using yarn
yarn i vercel

# Using npm
npm i vercel

# Using bun
bun i vercel
```

## Enable Web Analytics in Vercel

On the [Vercel dashboard](https://vercel.com/dashboard), select your Project and then click the **Analytics** tab and click **Enable** from the dialog.

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Add `@vercel/analytics` to Your Project

The `@vercel/analytics` package is already installed in this project. If you need to reinstall it, use your package manager of choice:

```bash
# Using pnpm
pnpm i @vercel/analytics

# Using yarn
yarn i @vercel/analytics

# Using npm
npm i @vercel/analytics

# Using bun
bun i @vercel/analytics
```

## Add the `Analytics` Component to Your App

Since this is a React/Create React App project, the `Analytics` component is a wrapper around the tracking script, offering more seamless integration with React.

The Analytics component has been added to the main App component (`src/App.js`):

```jsx
import { Analytics } from "@vercel/analytics/react";

function App() {
  // ... your app code ...
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          {/* ... routes and other components ... */}
          <Analytics />
          <SpeedInsights />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
```

The `Analytics` component should be placed near the end of your app hierarchy to ensure all routes are tracked. In this project, it's placed after all the main routing components.

> **💡 Note:** When using the React implementation, there is route support via React Router. The Analytics component will automatically track page views as users navigate through your app.

## Deploy Your App to Vercel

Deploy your app using the following command:

```bash
vercel deploy
```

If you haven't already, we also recommend [connecting your project's Git repository](https://vercel.com/docs/git), which will enable Vercel to deploy your latest commits to main without terminal commands.

Once your app is deployed, it will start tracking visitors and page views.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

## View Your Data in the Dashboard

Once your app is deployed, and users have visited your site, you can view your data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Analytics** tab.

After a few days of visitors, you'll be able to start exploring your data by viewing and [filtering](https://vercel.com/docs/analytics/filtering) the panels.

Users on Pro and Enterprise plans can also add [custom events](https://vercel.com/docs/analytics/custom-events) to their data to track user interactions such as button clicks, form submissions, or purchases.

Learn more about how Vercel supports [privacy and data compliance standards](https://vercel.com/docs/analytics/privacy-policy) with Vercel Web Analytics.

## Project-Specific Implementation Details

### Current Setup

This project has the following Vercel packages installed:

- `@vercel/analytics` - For web analytics tracking
- `@vercel/speed-insights` - For performance monitoring

Both components are integrated in the main `App.js` component to provide comprehensive insights into your application's performance and user behavior.

### Environment Variables

Vercel automatically handles the configuration of Web Analytics. No additional environment variables are required in your `.env` file for basic analytics functionality.

### Build and Deployment

The project is configured for deployment to Vercel. The build process is simple:

```bash
npm run build
```

This creates an optimized build folder ready for deployment.

## Next Steps

Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/analytics` package](https://vercel.com/docs/analytics/package)
- [Learn how to set custom events](https://vercel.com/docs/analytics/custom-events)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Read about privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Explore pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting](https://vercel.com/docs/analytics/troubleshooting)

## Troubleshooting

### Analytics not showing in dashboard

1. **Check that Web Analytics is enabled**: Go to your Vercel dashboard, select your project, and ensure the Analytics tab shows "Enabled"
2. **Verify deployment**: Make sure your app is deployed to Vercel (not just running locally)
3. **Wait for data**: It can take a few minutes to a few hours for initial data to appear
4. **Check network**: Open your browser's Network tab and look for a request to `/_vercel/insights/view` - this indicates the analytics script is running
5. **Check console**: Look for any errors in the browser console that might indicate issues with the analytics tracking

### Analytics component not loading

1. **Verify the import**: Ensure `import { Analytics } from "@vercel/analytics/react"` is correct
2. **Check placement**: The `Analytics` component should be within your React app (inside the Router if using React Router)
3. **Verify package version**: Run `npm list @vercel/analytics` to check if the package is properly installed
4. **Check for errors**: Look at your browser console and build logs for any errors

### Custom events not working

1. **Verify you're on the correct plan**: Custom events are available on Pro and Enterprise plans
2. **Check your code**: Ensure you're using the correct event tracking API from the `@vercel/analytics/react` package
3. **Review documentation**: See [custom events documentation](https://vercel.com/docs/analytics/custom-events) for proper implementation
