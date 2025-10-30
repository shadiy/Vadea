import type { Route } from "../+types/all";
import Videos from "~/components/videos";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "All Videos" },
      { name: "description", content: "All Videos" },
   ];
}

export default function Home() {
   return <Videos url="/api/videos/" queryKey="all-videos" />;
}
