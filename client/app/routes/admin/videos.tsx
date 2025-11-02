import { useNavigate } from "react-router";
import type { Route } from "./+types/videos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Manage Vidoes" },
      { name: "description", content: "Manage Vidoes" },
   ];
}

async function deleteVideo(name: string) {
   if (!confirm("Are you sure?")) return;

   await fetch(`/api/videos/${name}/delete`, {
      method: "DELETE",
      credentials: "include",
   });
}

function postFeaturedChanged(name: string) {
   return fetch(`/api/videos/${name}/feature`, {
      method: "POST",
      credentials: "include",
   });
}

async function postVideo(event: ChangeEvent<HTMLInputElement>) {
   const file = event.target.files[0];
   if (!file) return;

   const formData = new FormData();
   formData.append("videoFile", file);

   await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
   });
}

async function postRenameVideo({
   oldName,
   newName,
}: {
   oldName: string;
   newName: string;
}) {
   const name = newName.trim();

   if (name === "") return;
   if (name === oldName) return;

   await fetch(`/api/videos/${oldName}/rename`, {
      method: "POST",
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ newName: name }),
   });
}

export default function Home() {
   const hiddenFileInput = useRef(null);

   const queryClient = useQueryClient();

   const { isPending, error, data } = useQuery<Video[]>({
      queryKey: ["admin-videos"],
      queryFn: () => fetch("/api/videos").then((res) => res.json()),
   });

   const [sortedData, setSortedData] = useState<Video[]>([]);

   useEffect(() => {
      if (data) {
         const sorted = [...data].sort((a, b) => {
            return (
               new Date(a.uploadedAt).getTime() -
               new Date(b.uploadedAt).getTime()
            );
         });
         setSortedData(sorted);
      }
   }, [data]);

   const deleteVideoMutation = useMutation({
      mutationFn: deleteVideo,
      onSuccess: () =>
         queryClient.invalidateQueries({ queryKey: ["admin-videos"] }),
   });

   const postFeatureMutation = useMutation({
      mutationFn: postFeaturedChanged,
      onSuccess: () =>
         queryClient.invalidateQueries({ queryKey: ["admin-videos"] }),
   });

   const postVideoMutation = useMutation({
      mutationFn: postVideo,
      onSuccess: () =>
         queryClient.invalidateQueries({ queryKey: ["admin-videos"] }),
   });

   const renameVideoMutation = useMutation({
      mutationFn: postRenameVideo,
      onSuccess: () =>
         queryClient.invalidateQueries({ queryKey: ["admin-videos"] }),
   });

   if (isPending) return "Loading...";
   if (error) return "An error has occurred: " + error.message;

   return (
      <div className="flex flex-col gap-2 py-2">
         <form method="post" encType="multipart/form-data">
            {postVideoMutation.isPending ? (
               <button
                  disabled
                  type="button"
                  className="p-2 bg-blue-500/50 rounded"
               >
                  Uploading...
               </button>
            ) : (
               <button
                  type="button"
                  onClick={() => hiddenFileInput.current?.click()}
                  className="p-2 bg-blue-500 rounded"
               >
                  Upload Video
               </button>
            )}
            <input
               type="file"
               ref={hiddenFileInput}
               onChange={(event) => postVideoMutation.mutate(event)}
               name="videoFile"
               accept="video/*"
               hidden
            />
         </form>
         <table className="w-full">
            <thead>
               <tr className="border-b bg-[#202020] hover:bg-[#222] text-[#ddd]">
                  <th className="px-3 py-4 text-left font-medium">Preview</th>
                  <th className="px-3 py-4 text-left font-medium">Name</th>
                  <th className="px-3 py-4 text-left font-medium">
                     Uploaded At
                  </th>
                  <th className="px-3 py-4 text-left font-medium">Featured</th>
                  <th className="px-3 py-4 text-left font-medium">Actions</th>
               </tr>
            </thead>
            <tbody>
               {sortedData.map(({ name, featured, uploadedAt }) => (
                  <tr className="border-b bg-[#202020] hover:bg-[#222] text-[#ddd]">
                     <td className="px-3 py-4 text-left font-medium bg-transparent overflow-hidden object-cover">
                        <video
                           src={`/api/videos/${name}`}
                           className="w-32 block"
                           muted
                        />
                     </td>
                     <td className="px-3 py-4 text-left font-medium text-ellipsis max-w-2xl overflow-hidden whitespace-nowrap">
                        <input
                           className="bg-transparent rounded p-2 border border-stone-600"
                           defaultValue={name}
                           onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                 renameVideoMutation.mutate({
                                    oldName: name,
                                    newName: e.currentTarget.value,
                                 });
                              }
                           }}
                           onBlur={(e) => {
                              renameVideoMutation.mutate({
                                 oldName: name,
                                 newName: e.currentTarget.value,
                              });
                           }}
                        />
                     </td>
                     <td className="px-3 py-4 text-left font-medium">
                        <p>{new Date(uploadedAt).toLocaleDateString()}</p>
                     </td>
                     <td className="px-3 py-4">
                        <input
                           type="checkbox"
                           checked={featured}
                           onChange={() => postFeatureMutation.mutate(name)}
                           className="w-6 h-6"
                        />
                     </td>
                     <td className="px-3 py-4 text-left font-medium">
                        <button
                           className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                           onClick={() => deleteVideoMutation.mutate(name)}
                        >
                           Delete
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
