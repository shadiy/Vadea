import type { Route } from "./+types/featured";
import { useParams } from "react-router";
import { RandomVideos } from "~/components/random-videos";

export function meta({}: Route.MetaArgs) {
   return [{ title: "Video" }, { name: "description", content: "Video" }];
}

export default function Home() {
   const { name } = useParams();

   return (
      <main className="flex flex-col md:flex-row gap-6 p-3">
         <div className="flex flex-col gap-3 grow mt-4 w-full md:w-9/12">
            <video
               controls
               src={`/api/videos/${name}`}
               className="grow h-auto w-full"
            />
            <h2 className="text-3xl font-bold">{name}</h2>
         </div>

         <div className="mt-4 mr-4">
            <RandomVideos />
         </div>
      </main>
   );
}
