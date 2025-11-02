import { Outlet, NavLink } from "react-router";

export default function Home() {
   return (
      <main className="w-full p-4">
         <h2 className="text-3x py-2l">Manage Videos</h2>

         <div className="flex flex-row">
            <NavLink
               to="/admin/videos"
               viewTransition
               className={({ isActive }) =>
                  isActive
                     ? `border-b-4  border-b-blue-400 p-4 cursor-pointer`
                     : `p-4 cursor-pointer`
               }
            >
               Videos
            </NavLink>
            <NavLink
               to="/admin/playlists"
               viewTransition
               className={({ isActive }) =>
                  isActive
                     ? `border-b-4  border-b-blue-400 p-4 cursor-pointer`
                     : `p-4 cursor-pointer`
               }
            >
               Playlists
            </NavLink>
         </div>

         <Outlet />
      </main>
   );
}
