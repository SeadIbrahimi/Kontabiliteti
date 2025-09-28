import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
      <h1 className="text-3xl font-semibold mb-2">404 - Faqja nuk u gjet</h1>
      <p className="text-gray-600 mb-4">
        Faqja që po kërkoni nuk ekziston ose është zhvendosur.
      </p>
      <Link to="/" className="text-blue-600 hover:underline font-medium">
        Kthehu në faqen kryesore
      </Link>
    </div>
  );
}
