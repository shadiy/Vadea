import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/playlists";
import { Link } from "react-router";
import Videos from "~/components/videos";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Playlists" },
      { name: "description", content: "Playlists" },
   ];
}

export default function Home() {
   const { isPending, error, data } = useQuery({
      queryKey: ["playlists"],
      queryFn: () => fetch("/api/playlists").then((res) => res.json()),
   });

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <div className="flex flex-col gap-4 w-full p-4">
         {data.map((name: string) => (
            <div className="flex flex-col gap-2 w-full">
               <div className="flex flex-row gap-2 w-full items-center">
                  <h2 className="text-lg">{name}</h2>
                  <Link
                     to={`/playlist/${name}`}
                     className="p-2 bg-stone-600/90 hover:bg-stone-600/70 rounded"
                  >
                     Play
                  </Link>
               </div>
               <div className="flex flex-col md:flex-row gap-4 w-full ml-2">
                  <Videos
                     url={`/api/playlists/${name}`}
                     queryKey={`playlist-${name}`}
                  />
               </div>
            </div>
         ))}
      </div>
   );
}
