import { useNavigate } from "react-router";
import type { Route } from "./+types/playlists";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, type ChangeEvent } from "react";
import { NavLink } from "react-router";
import { useParams } from "react-router";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Manage Playlists" },
      { name: "description", content: "Manage Playlists" },
   ];
}

export default function Home() {
   const { isPending, error, data } = useQuery({
      queryKey: ["admin-playlists"],
      queryFn: () =>
         fetch("/api/playlists")
            .then((res) => res.json())
            .then((res) => JSON.parse(res)),
   });

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <div className="flex flex-col gap-2 py-2">
         <NavLink
            to={"/admin/playlists/new"}
            className="bg-blue-500 hover:bg-blue-600 p-4 w-24"
         >
            Create Playlist
         </NavLink>

         <table className="w-full">
            <thead>
               <tr className="border-b bg-[#202020] hover:bg-[#222] text-[#ddd]">
                  <th className="px-3 py-4 text-left font-medium">Name</th>
                  <th className="px-3 py-4 text-left font-medium">Public</th>
                  <th className="px-3 py-4 text-left font-medium">Actions</th>
               </tr>
            </thead>
            <tbody>
               {data.map((name: string) => (
                  <tr className="border-b bg-[#202020] hover:bg-[#222] text-[#ddd]">
                     <td className="px-3 py-4 text-left font-medium text-ellipsis max-w-2xl overflow-hidden whitespace-nowrap">
                        <h2 className="text-lg">{name}</h2>
                     </td>
                     <td className="px-3 py-4 text-left font-medium">
                        <input
                           type="checkbox"
                           checked={false}
                           onChange={() =>
                              console.log("TODO: change to public")
                           }
                           className="w-6 h-6"
                        />
                     </td>
                     <td className="px-3 py-4 text-left font-medium">
                        <NavLink
                           to={`/admin/playlists/${name}`}
                           className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
                        >
                           Edit
                        </NavLink>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
