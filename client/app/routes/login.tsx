import { useState, type FormEvent } from "react";
import type { Route } from "./+types/login";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
   return [{ title: "Login" }, { name: "description", content: "Login" }];
}

export default function Home() {
   const [password, setPassword] = useState<string>("");
   const [error, setError] = useState("");
   const navigate = useNavigate();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault(); // Prevent default form submission behavior

      fetch("/api/login", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
         },
         body: JSON.stringify({ password }),
      }).then((res) => {
         if (res.ok) {
            navigate("/admin");
         } else {
            res.json().then((data) => {
               setError(data.title);
               console.error(data);
            });
         }
      });
   };

   return (
      <main className="w-full h-full">
         <form
            onSubmit={handleSubmit}
            className="mx-auto mt-64 flex flex-col gap-4 w-64"
         >
            <input
               type="password"
               name="password"
               value={password}
               onChange={handleChange}
               placeholder="password..."
               required
               className="h-12 p-1 border rounded"
            />
            <button
               type="submit"
               className="bg-blue-500 p-4 text-white rounded"
            >
               Login
            </button>
            {error && <p className="p-6 bg-red-400 text-black">{error}</p>}
         </form>
      </main>
   );
}
