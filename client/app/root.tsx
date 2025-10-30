import {
   isRouteErrorResponse,
   Link,
   Links,
   Meta,
   Outlet,
   Scripts,
   ScrollRestoration,
} from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { Route } from "./+types/root";
import "./app.css";

const queryClient = new QueryClient();

export const links: Route.LinksFunction = () => [
   { rel: "preconnect", href: "https://fonts.googleapis.com" },
   {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
   },
   {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
   },
];

export function Layout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <head>
            <meta charSet="utf-8" />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1"
            />
            <Meta />
            <Links />
         </head>
         <body>
            <QueryClientProvider client={queryClient}>
               <header className="flex justify-between items-center p-5 border-b-1 border-b-[#333] gap-5  bg-[#1c1c1c]">
                  <h1 className="text-2xl font-bold inline-block align-middle">
                     <a href="/">Vadea</a>
                  </h1>
                  <Link to="/login">Admin</Link>
               </header>

               {children}

               <footer className="flex flex-col items-center justify-center p-10 bg-[#1c1c1c] text-[#aaa] text-sm mt-12 gap-8">
                  <p>
                     Videa created by <span className="font-bold">Shadiy</span>
                  </p>
                  <div className="flex gap-4">
                     <a
                        href="https://x.com/lazargg"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <svg
                           role="img"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                           className="w-6 h-6 brightness-0 invert transform duration-200 ease-in-out hover:scale-110 hover:brightness-90"
                        >
                           <title>X</title>
                           <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                        </svg>
                     </a>
                     <a
                        href="https://github.com/shadiy"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <svg
                           role="img"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                           className="w-6 h-6 brightness-0 invert transform duration-200 ease-in-out hover:scale-110 hover:brightness-90"
                        >
                           <title>GitHub</title>
                           <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                     </a>
                  </div>
               </footer>
            </QueryClientProvider>
            <ScrollRestoration />
            <Scripts />
         </body>
      </html>
   );
}

export default function App() {
   return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
   let message = "Oops!";
   let details = "An unexpected error occurred.";
   let stack: string | undefined;

   if (isRouteErrorResponse(error)) {
      message = error.status === 404 ? "404" : "Error";
      details =
         error.status === 404
            ? "The requested page could not be found."
            : error.statusText || details;
   } else if (import.meta.env.DEV && error && error instanceof Error) {
      details = error.message;
      stack = error.stack;
   }

   return (
      <main className="pt-16 p-4 container mx-auto">
         <h1>{message}</h1>
         <p>{details}</p>
         {stack && (
            <pre className="w-full p-4 overflow-x-auto">
               <code>{stack}</code>
            </pre>
         )}
      </main>
   );
}
