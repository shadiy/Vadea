import type { Route } from "./+types/featured";
import { useParams } from "react-router";
import Videos from "~/components/videos";

export function meta({}: Route.MetaArgs) {
   return [{ title: "Video" }, { name: "description", content: "Video" }];
}

export default function Home() {
   const { name } = useParams();

   return (
      <main className="flex flex-col md:flex-row gap-6 p-3">
         <div className="flex flex-col gap-3 grow mt-4 w-full md:w-4/5">
            <video
               controls
               src={`/api/videos/${name}`}
               className="grow h-auto w-full"
            />
            <h2 className="text-3xl font-bold">{name}</h2>
         </div>

         <div className="mt-4 mr-4 flex flex-col gap-4">
            <Videos url="/api/videos/random" queryKey="random-videos" />
         </div>
      </main>
   );
}
