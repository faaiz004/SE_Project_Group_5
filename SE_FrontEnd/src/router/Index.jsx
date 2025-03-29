import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy loaded components
const ExplorePage = lazy(() => import("../pages/ExplorePage/Index"));
const StyleFeed = lazy(() => import("../pages/StyleFeed/Index"));

// Route configuration using modern React Router (v7+)
const router = createBrowserRouter([
  {
    path: "/explore",
    element: (
      <Suspense fallback={<div>Loading Explore Page...</div>}>
        <ExplorePage />
      </Suspense>
    ),
  },
  {
    path: "/stylefeed",
    element: (
      <Suspense fallback={<div>Loading Style Feed...</div>}>
        <StyleFeed />
      </Suspense>
    ),
  },
]);

export default function RouterComponent() {
  return <RouterProvider router={router} />;
}
