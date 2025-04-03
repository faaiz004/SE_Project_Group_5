import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

// Lazy loaded components
const ExplorePage = lazy(() => import("../pages/ExplorePage/Index"));
const StyleFeed = lazy(() => import("../pages/StyleFeed/Index"));
const CartPage = lazy(() => import("../pages/CartPage/Index"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage/Index"));
const CardPaymentPage = lazy(() => import("../pages/CardPaymentPage/Index"));
const OrderConfirmation = lazy(() => import("../pages/OrderConfirmation/Index"));
const MannequinPage = lazy(() => import("../pages/MannequinPage/Index"));


// Route configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/explore" replace />,
  },
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
  {
    path: "/cart",
    element: (
      <Suspense fallback={<div>Loading Cart...</div>}>
        <CartPage />
      </Suspense>
    ),
  },
  {
    path: "/checkout",
    element: (
      <Suspense fallback={<div>Loading Checkout...</div>}>
        <CheckoutPage />
      </Suspense>
    ),
  },
  {
    path: "/card-payment",
    element: (
      <Suspense fallback={<div>Loading Payment...</div>}>
        <CardPaymentPage />
      </Suspense>
    ),
  },
  {
    path: "/order-confirmation",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <OrderConfirmation />
      </Suspense>
    ),
  },
  {
    path: "/mannequin",
    element: (
      <Suspense fallback={<div>Loading Mannequin Page...</div>}>
        <MannequinPage />
      </Suspense>
    ),
  }
]);

export default function RouterComponent() {
  return <RouterProvider router={router} />;
}