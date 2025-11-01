import { Outlet, NavLink } from "react-router";

export default function Home() {
   return (
      <main>
         <section className="flex items-center gap-6 border-b-1 border-b-[#333] bg-[#121212] p-8">
            <img
               src="/channel-icon.jpg"
               alt="Channel Picture"
               className="w-32 h-32 rounded-full"
            />
            <div className="flex-1">
               <h2 className="text-3xl font-bold">Vadea</h2>
               <p className="text-[#aaa] max-w-3xl">
                  Welcome to Vadea! Explore featured videos, playlists, and our
                  full video collection.
               </p>
            </div>
         </section>

         <section className="pl-4 flex justify-start bg-[#1c1c1c] border-b-1 border-b-[#333]">
            {tabs.map((tab) => (
               <NavLink
                  key={tab.name}
                  to={tab.href}
                  prefetch="intent"
                  viewTransition
                  className={({ isActive }) =>
                     isActive
                        ? `border-b-4  border-b-blue-400 p-4 cursor-pointer`
                        : `p-4 cursor-pointer`
                  }
               >
                  {tab.name}
               </NavLink>
            ))}
         </section>

         <Outlet />
      </main>
   );
}

const tabs = [
   {
      name: "Featured",
      href: "/featured",
   },
   {
      name: "All",
      href: "/all",
   },
   {
      name: "Playlists",
      href: "/playlists",
   },
];
