import type { Route } from "../+types/all";
import Videos from "~/components/videos";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "All Videos" },
      { name: "description", content: "All Videos" },
   ];
}

export default function Home() {
   return (
      <section className="flex flex-col md:flex-row gap-4 p-6 bg-[#121212]">
         <Videos url="/api/videos/" queryKey="all-videos" />
      </section>
   );
}
