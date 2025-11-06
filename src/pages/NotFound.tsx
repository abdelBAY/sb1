import { useRouteError, Link } from "react-router-dom";

export default function NotFound() {
  const error: any = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        {error?.statusText || "Sorry, we couldn’t find the page you’re looking for."}
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-3 px-5 py-2.5 text-white font-semibold uppercase tracking-wide rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
