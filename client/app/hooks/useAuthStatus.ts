import { useEffect, useState } from "react";

export function useAuthStatus() {
   const [auth, setAuth] = useState<{ loggedIn: boolean }>({
      loggedIn: false,
   });

   useEffect(() => {
      fetch("/api/auth/status", { credentials: "include" })
         .then((res) => res.json())
         .then((data) => setAuth(data))
         .catch(() => setAuth({ loggedIn: false }));
   }, []);

   return auth;
}
