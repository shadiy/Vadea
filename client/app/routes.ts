import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
   route("/", "routes/index.tsx", [
      index("routes/index/index.tsx"),
      route("featured", "routes/index/featured.tsx"),
      route("all", "routes/index/all.tsx"),
      route("playlists", "routes/index/playlists.tsx"),
   ]),
   route("admin", "routes/admin/layout.tsx", [
      index("routes/admin/index.tsx"),
      route("videos", "routes/admin/videos.tsx"),
      route("playlists", "routes/admin/playlists.tsx"),
      route("playlists/:name", "routes/admin/playlist-manage.tsx"),
   ]),
   route("login", "routes/login.tsx"),
   route("/videos/:name", "routes/video.tsx"),
   route("/playlist/:name", "routes/playlist.tsx"),
] satisfies RouteConfig;
