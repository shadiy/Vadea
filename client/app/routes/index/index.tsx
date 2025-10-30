import type { Route } from "../+types/featured";
import Videos from "~/components/videos";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Featured Videos" },
      { name: "description", content: "Featured Videos" },
   ];
}

export default function Home() {
   return <Videos url="/api/videos/featured" queryKey="featured-videos" />;
}
