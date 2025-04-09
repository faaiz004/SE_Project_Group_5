import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

// Lazy loaded components
const ExplorePage = lazy(() => import("../pages/ExplorePage/Index"));
const StyleFeed = lazy(() => import("../pages/StyleFeed/Index"));
const CartPage = lazy(() => import("../pages/CartPage/Index"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage/Index"));
const CardPaymentPage = lazy(() => import("../pages/CardPaymentPage/Index"));
const OrderConfirmation = lazy(() =>
	import("../pages/OrderConfirmation/Index")
);
const SwipeFitPage = lazy(() => import("../pages/SwipeFitPage/index"));
const LandingPage = lazy(() => import("../pages/LandingPage/Index"));
const SignUpPage = lazy(() => import("../pages/SignUp/Index"));
const UploadPhotos = lazy(() => import("../pages/UploadPhotos/Index"));
const Chatbot = lazy(() => import("../pages/Chatbot/Index"));
const GenderPreference = lazy(() => import("../pages/GenderPreference/Index"));
const WeightPreference = lazy(() => import("../pages/WeightPreference/Index"));
const StylePreferences = lazy(() => import("../pages/StylePreferences/Index"));
const PreferencesShirts = lazy(() =>
	import("../pages/PreferencesShirts/Index")
);
const PreferencesPants = lazy(() => import("../pages/PreferencesPants/Index"));
const SignInPage = lazy(() => import("../pages/LoginPage/Index"));
// Route configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LandingPage />
      </Suspense>
    )
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
    path: "/sign-up",
    element: (
      <Suspense fallback={<div>Loading Sign In 2...</div>}>
        <SignUpPage />
      </Suspense>
    ),
  },
  {
    path: "/chatbot", // New chatbot route (if you prefer full-page view)
    element: (
      <Suspense fallback={<div>Loading Chatbot...</div>}>
        <Chatbot />
      </Suspense>
    ),
  },
  {
    path: '/upload-photos',
    element: (
      <Suspense fallback={<div>Loading Upload Photo...</div>}>
        <UploadPhotos />
      </Suspense>
    ),
  },
  {
    path: "/mannequin",
    element: (
      <Suspense fallback={<div>Loading Mannequin Page...</div>}>
        <SwipeFitPage />
      </Suspense>
    ),
  },
  {
    path: '/preferences/gender',
    element: (
      <Suspense fallback={<div>Loading Gender PageRevealEvent...</div>}>
        <GenderPreference />
      </Suspense>
    )
  }, 
  {
    path: '/preferences/weight',
    element: (
      <Suspense fallback={<div>Loading Weight PageRevealEvent...</div>}>
        <WeightPreference />
      </Suspense>
    )
  },
  {
    path: '/preferences/style',
    element: (
      <Suspense fallback={<div>Loading Style PageRevealEvent...</div>}>
        <StylePreferences />
      </Suspense>
    )
  },
  {
    path: '/preferences/shirts',
    element: (
      <Suspense fallback={<div>Loading Shirt PageRevealEvent...</div>}>
        <PreferencesShirts />
      </Suspense>
    )
  },
  {
    path: '/preferences/pants',
    element: (
      <Suspense fallback={<div>Loading Pants PageRevealEvent...</div>}>
        <PreferencesPants />
      </Suspense>
    )
  },
  {
    path: "/sign-in",
    element: (
      <Suspense fallback={<div>Loading Sign In...</div>}>
        <SignInPage />
      </Suspense>
    ),
  }
]);

export default function RouterComponent() {
	return <RouterProvider router={router} />;
}
