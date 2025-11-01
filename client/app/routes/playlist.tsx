import { useEffect, useState } from "react";
import type { Route } from "./+types/featured";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

export function meta({}: Route.MetaArgs) {
   return [{ title: "Playlist" }, { name: "description", content: "Playlist" }];
}

export default function Home() {
   const { name } = useParams();

   const { isPending, error, data } = useQuery<Video[]>({
      queryKey: ["playlist"],
      queryFn: async () => {
         const res = await fetch(`/api/playlists/${name}`);
         if (res.ok) {
            return await res.json();
         }

         return [];
      },
      refetchOnWindowFocus: false,
   });

   const [currentVideo, setCurrentVideo] = useState<string>("");

   useEffect(() => {
      if (data) {
         setCurrentVideo(data[0].name);
      }
   }, [data]);

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <main className="flex flex-col md:flex-row gap-6 p-3">
         <div className="flex flex-col gap-3 grow mt-4 w-full md:w-4/5">
            <video
               controls
               src={`/api/videos/${currentVideo}`}
               className="grow h-auto w-full"
            />
            <h2 className="text-3xl font-bold">{name}</h2>
         </div>

         <div className="mt-4 mr-4 flex flex-col gap-4">
            {data.map(({ name, uploadedAt }) => (
               <button
                  className="bg-transparent overflow-hidden cursor-pointer w-full md:w-64"
                  onClick={() => setCurrentVideo(name)}
               >
                  <video
                     src={`/api/videos/${name}`}
                     muted
                     className="block w-full h-44 transition duration-200 ease-in-out hover:scale-105 hover:shadow-2xl object-fill"
                  />
                  <div className="flex flex-row justify-between pt-2">
                     <p className="text-sm text-ellipsis max-w-3/4 overflow-hidden whitespace-nowrap">
                        {name}
                     </p>
                     <p className="text-sm">
                        {new Date(uploadedAt).toLocaleDateString()}
                     </p>
                  </div>
               </button>
            ))}
         </div>
      </main>
   );
}
