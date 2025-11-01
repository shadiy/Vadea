import { Navigate } from "react-router";
import type { Route } from "../+types/featured";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Featured Videos" },
      { name: "description", content: "Featured Videos" },
   ];
}

export default function Home() {
   return <Navigate to="/featured" replace />;
}
