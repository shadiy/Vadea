import type { Route } from "../+types/featured";
import Videos from "~/components/videos";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Featured Videos" },
      { name: "description", content: "Featured Videos" },
   ];
}

export default function Home() {
   return (
      <section className="flex flex-col md:flex-row gap-4 p-6 bg-[#121212]">
         <Videos url="/api/videos/featured" queryKey="featured-videos" />
      </section>
   );
}
