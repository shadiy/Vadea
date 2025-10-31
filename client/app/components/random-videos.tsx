import { useQuery } from "@tanstack/react-query";
import { Thumbnail } from "./thumbnail";

export function RandomVideos() {
   const { isPending, error, data } = useQuery({
      queryKey: ["random"],
      queryFn: () => fetch("/api/videos/random").then((res) => res.json()),
   });

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <ul>
         {data.map(({ name, uploadedAt }: any) => (
            <li key={name} className="list-none mb-6">
               <Thumbnail key={name} videoName={name} uploadedAt={uploadedAt} />
            </li>
         ))}
      </ul>
   );
}
