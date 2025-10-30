import type { Route } from "./+types/playlists";

export function meta({}: Route.MetaArgs) {
   return [
      { title: "Playlists" },
      { name: "description", content: "Playlists" },
   ];
}

export default function Home() {
   return (
      <div className="tab-panel" id="playlists">
         <div className="playlist-grid" id="playlistGrid">
            <p>No playlists yet.</p>
         </div>
      </div>
   );
}
