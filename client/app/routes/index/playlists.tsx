import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/playlists";
import { Link } from "react-router";
import Videos from "~/components/videos";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Featured Videos" },
      { name: "description", content: "Featured Videos" },
   ];
}

export default function Home() {
   const { isPending, error, data } = useQuery({
      queryKey: ["playlists"],
      queryFn: () =>
         fetch("/api/playlists")
            .then((res) => res.json())
            .then((res) => JSON.parse(res)),
   });

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <div className="flex flex-col">
         {data.map(({ name, videos }: { name: string; videos: string[] }) => (
            <div className="flex flex-col gap-2 w-full">
               <div className="flex flex-row gap-2 w-full">
                  <h2 className="text-2xl">{name}</h2>
                  <Link
                     to={`/playlist/${name}`}
                     className="text-base bg-transparent hover:bg-stone-600/80"
                     onClick={() => {
                        console.log("clicked");
                     }}
                  >
                     Play
                  </Link>
               </div>
               <div className="flex flex-row gap-2 w-full">
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
