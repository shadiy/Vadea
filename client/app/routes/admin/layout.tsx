import { Outlet, NavLink, useNavigate } from "react-router";

export default function Home() {
   const navigate = useNavigate();

   return (
      <main className="w-full p-4">
         <div className="flex flex-row justify-between items-center py-2">
            <h2 className="text-3xl">Manage Videos</h2>

            <button
               type="button"
               onClick={() => {
                  fetch("/api/logout", { method: "POST" }).then((res) => {
                     if (res.ok) {
                        navigate("/login");
                     }
                  });
               }}
               className="p-2 bg-red-500 rounded"
            >
               Logout
            </button>
         </div>

         <div className="flex flex-row">
            <NavLink
               to={"/admin/videos"}
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
               to={"/admin/playlists"}
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
