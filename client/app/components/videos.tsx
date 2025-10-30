import { useQuery } from "@tanstack/react-query";
import { Thumbnail } from "./thumbnail";

export default function Videos({
   url,
   queryKey,
}: {
   url: string;
   queryKey: string;
}) {
   const { isPending, error, data } = useQuery({
      queryKey: [queryKey],
      queryFn: () =>
         fetch(url)
            .then((res) => res.json())
            .then((res) => JSON.parse(res)),
   });

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <>
         {data.map((name: string) => (
            <Thumbnail key={name} videoName={name} />
         ))}
      </>
   );
}
