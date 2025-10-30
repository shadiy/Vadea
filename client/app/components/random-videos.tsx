import { useQuery } from "@tanstack/react-query";
import { Thumbnail } from "./thumbnail";

export function RandomVideos() {
   const { isPending, error, data } = useQuery({
      queryKey: ["random"],
      queryFn: () =>
         fetch("/api/videos/random")
            .then((res) => res.json())
            .then((res) => JSON.parse(res)),
   });

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <ul>
         {data.map((video: string) => (
            <li key={video} className="list-none mb-6">
               <Thumbnail key={video} videoName={video} />
            </li>
         ))}
      </ul>
   );
}
