import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import SwipeFitPage from "../pages/SwipeFitPage/index";

const ExplorePage = lazy(() => import("../pages/ExplorePage/Index"));
const StyleFeed = lazy(() => import("../pages/StyleFeed/Index"));
const CartPage = lazy(() => import("../pages/CartPage/index"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage/index"));
const CardPaymentPage = lazy(() => import("../pages/CardPaymentPage/index"));
const OrderConfirmation = lazy(() =>
	import("../pages/OrderConfirmation/index")
);
const LandingPage = lazy(() => import("../pages/LandingPage/Index"));
const SignUpPage = lazy(() => import("../pages/SignUp/Index"));
const UploadPhotos = lazy(() => import("../pages/UploadPhotos/Index"));
const Chatbot = lazy(() => import("../pages/Chatbot/index"));
const GenderPreference = lazy(() => import("../pages/GenderPreference/Index"));
const WeightPreference = lazy(() => import("../pages/WeightPreference/Index"));
const StylePreferences = lazy(() => import("../pages/StylePreferences/Index"));
const SignInPage = lazy(() => import("../pages/LoginPage/Index"));
const AccountPage = lazy(() => import("../pages/Account/index"));
const AllClothesSearch = lazy(() => import("../pages/AllClothesSearch/Index"));

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import PreferenceGuardRoute from "./PreferenceGuardRoute";

const suspense = (node, msg) => (
	<Suspense fallback={<div>{msg}</div>}>{node}</Suspense>
);

const router = createBrowserRouter([
	{
		path: "/",
		element: suspense(
			<PublicRoute>
				<LandingPage />
			</PublicRoute>,
			"Loading Landing..."
		),
	},
	{
		path: "/sign-in",
		element: suspense(
			<PublicRoute>
				<SignInPage />
			</PublicRoute>,
			"Loading Sign-In..."
		),
	},
	{
		path: "/sign-up",
		element: suspense(
			<PublicRoute>
				<SignUpPage />
			</PublicRoute>,
			"Loading Sign-Up..."
		),
	},


	{
		path: "/preferences/gender",
		element: suspense(
			<PrivateRoute>
				<GenderPreference />
			</PrivateRoute>,
			"Loading Gender Pref..."
		),
	},
	{
		path: "/preferences/weight",
		element: suspense(
			<PrivateRoute>
				<WeightPreference />
			</PrivateRoute>,
			"Loading Weight Pref..."
		),
	},
	{
		path: "/preferences/style",
		element: suspense(
			<PrivateRoute>
				<StylePreferences />
			</PrivateRoute>,
			"Loading Style Pref..."
		),
	},
	{
		path: "/explore",
		element: suspense(
			<PreferenceGuardRoute>
				<ExplorePage />
			</PreferenceGuardRoute>,
			"Loading Explore..."
		),
	},
	{
		path: "/stylefeed",
		element: suspense(
			<PreferenceGuardRoute>
				<StyleFeed />
			</PreferenceGuardRoute>,
			"Loading Style Feed..."
		),
	},
	{
		path: "/cart",
		element: suspense(
			<PreferenceGuardRoute>
				<CartPage />
			</PreferenceGuardRoute>,
			"Loading Cart..."
		),
	},
	{
		path: "/checkout",
		element: suspense(
			<PreferenceGuardRoute>
				<CheckoutPage />
			</PreferenceGuardRoute>,
			"Loading Checkout..."
		),
	},
	{
		path: "/card-payment",
		element: suspense(
			<PreferenceGuardRoute>
				<CardPaymentPage />
			</PreferenceGuardRoute>,
			"Loading Payment..."
		),
	},
	{
		path: "/order-confirmation",
		element: suspense(
			<PreferenceGuardRoute>
				<OrderConfirmation />
			</PreferenceGuardRoute>,
			"Loading Confirmation..."
		),
	},
	{
		path: "/mannequin",
		element: suspense(
			<PreferenceGuardRoute>
				<SwipeFitPage />
			</PreferenceGuardRoute>,
			"Loading Mannequin..."
		),
	},
	{
		path: "/chatbot",
		element: suspense(
			<PreferenceGuardRoute>
				<Chatbot />
			</PreferenceGuardRoute>,
			"Loading Chatbot..."
		),
	},
	{
		path: "/upload-photos",
		element: suspense(
			<PreferenceGuardRoute>
				<UploadPhotos />
			</PreferenceGuardRoute>,
			"Loading Upload..."
		),
	},
	{
		path: "/account",
		element: suspense(
			<PreferenceGuardRoute>
				<AccountPage />
			</PreferenceGuardRoute>,
			"Loading Account..."
		),
	},
	{
		path: "/all-clothes-search",
		element: (
			<Suspense fallback={<div>Loading All Clothes Search...</div>}>
				<AllClothesSearch />
			</Suspense>
		),
	},
	{
		path: "*",
		element: suspense(
			<PublicRoute>
				<LandingPage />
			</PublicRoute>,
			"Redirecting..."
		),
	},
]);

export default function RouterComponent() {
	return <RouterProvider router={router} />;
}
