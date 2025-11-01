import { Navigate } from "react-router";
import type { Route } from "../../+types/index";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Admin" },
      { name: "description", content: "Admin Dashboard" },
   ];
}

export default function Home() {
   return <Navigate to="/admin/videos" replace />;
}
