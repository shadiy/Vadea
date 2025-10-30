import type { Route } from "./+types/playlist-manage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { SearchAndSelect } from "~/components/video-search";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Manage Playlist" },
      { name: "description", content: "Manage Playlist" },
   ];
}

async function deletePlaylist(name: string) {
   if (name === "") return;
   if (!confirm("Are you sure?")) return;

   await fetch(`/api/playlists/${name}`, {
      method: "DELETE",
   });
}

interface Playlist {
   name: string;
   videos: string[];
}

async function postPlaylist(playlist: Playlist) {
   if (playlist.name === "") return;

   await fetch(`/api/playlists`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(playlist),
   });
}

export default function Home() {
   const { name } = useParams();
   const newPlaylist = name === "new";

   const navigate = useNavigate();

   const [playlistName, setPlaylistName] = useState<string>("");
   const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

   const queryClient = useQueryClient();

   const playlistQuery = useQuery({
      queryKey: ["admin-playlist"],
      queryFn: () =>
         fetch(`/api/playlists/${name}`)
            .then((res) => res.json())
            .then((res) => JSON.parse(res)),
      enabled: !newPlaylist,
   });

   let isPending = playlistQuery.isPending;
   let error = playlistQuery.error;
   let data: Playlist = playlistQuery.data ?? { name: "", videos: [] };

   setPlaylistName(data.name);
   setSelectedVideos(data.videos);

   const videosQuery = useQuery({
      queryKey: ["all-videos"],
      queryFn: () =>
         fetch("/api/videos/")
            .then((res) => res.json())
            .then((res) => JSON.parse(res)),
   });

   const deleteMutation = useMutation({
      mutationFn: deletePlaylist,
      onSuccess: () =>
         queryClient.invalidateQueries({ queryKey: ["admin-playlist"] }),
   });

   const postMutation = useMutation({
      mutationFn: postPlaylist,
      onSuccess: () =>
         queryClient.invalidateQueries({ queryKey: ["admin-playlist"] }),
   });

   const handleAdd = (item: string) =>
      setSelectedVideos((prev) => [...prev, item]);

   const handleRemove = (item: string) =>
      setSelectedVideos((prev) => prev.filter((i) => i !== item));

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <div className="flex flex-col gap-4 py-6 mx-auto max-w-3xl">
         <button
            onClick={() => navigate("/admin/playlists")}
            className="p-2 bg-blue-500 hover:bg-blue-600 w-28 rounded"
         >
            {"<- Back"}
         </button>

         <div className="flex flex-row gap-2 w-full items-center">
            <p className="text-lg">Name:</p>
            <input
               type="text"
               value={playlistName}
               onChange={(e) => setPlaylistName(e.target.value)}
               className="bg-transparent rounded p-2 border border-stone-600 grow"
            />
         </div>

         {videosQuery.isPending ? (
            <p className="text-lg">Loading...</p>
         ) : (
            <SearchAndSelect
               items={videosQuery.data}
               selected={selectedVideos}
               onAdd={handleAdd}
               onRemove={handleRemove}
               placeholder="Select videos..."
            />
         )}

         <div className="flex flex-row gap-2 self-end">
            <button
               onClick={() => {
                  postMutation.mutate({
                     name: playlistName,
                     videos: selectedVideos,
                  });

                  if (postMutation.isSuccess) {
                     navigate("/admin/playlists");
                  }
               }}
               className="p-2 bg-blue-500 hover:bg-blue-600 w-24 rounded"
            >
               Finish
            </button>

            {!newPlaylist && (
               <button
                  onClick={() => deleteMutation.mutate(name ?? "")}
                  className="p-2 bg-red-500 hover:bg-red-600 w-24 rounded"
               >
                  Delete
               </button>
            )}
         </div>
      </div>
   );
}
