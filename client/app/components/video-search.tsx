import React, { useState } from "react";

interface SearchAndSelectProps {
   items: string[]; // all available items to search from
   selected: string[]; // currently selected items (controlled)
   onAdd: (item: string) => void; // called when an item is added
   onRemove: (item: string) => void; // called when an item is removed
   placeholder?: string; // optional input placeholder
}

export function SearchAndSelect({
   items,
   selected,
   onAdd,
   onRemove,
   placeholder = "Search...",
}: SearchAndSelectProps) {
   const [query, setQuery] = useState("");

   const filtered = query.trim()
      ? items.filter(
           (item) =>
              item.toLowerCase().includes(query.toLowerCase()) &&
              !selected.includes(item),
        )
      : items.filter((item) => !selected.includes(item));

   return (
      <div className="flex flex-col md:flex-row gap-4 py-4 max-w-3xl max-h-96">
         {/* Left side: Search and results */}
         <div className="w-full md:w-1/2">
            <input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder={placeholder}
               className="w-full p-2 border rounded-lg h-10"
            />

            {filtered.length > 0 && (
               <ul className="mt-2 border rounded-lg divide-y shadow-sm">
                  {filtered.map((item) => (
                     <li
                        key={item}
                        onClick={() => {
                           onAdd(item);
                           setQuery("");
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-stone-600/80 transition-colors"
                     >
                        {item}
                     </li>
                  ))}
               </ul>
            )}
         </div>

         {/* Right side: Selected items */}
         <div className="w-full md:w-1/2">
            <h3 className="text-3xl font-semibold mb-2 h-10">Selected</h3>
            {selected.length === 0 ? (
               <p className="text-gray-500 text-sm">No items selected.</p>
            ) : (
               <ul className="mt-2 border rounded-lg divide-y shadow-sm max-h-96">
                  {selected.map((item) => (
                     <li
                        key={item}
                        onClick={() => onRemove(item)}
                        className="px-3 py-2 cursor-pointer hover:bg-stone-600/80 transition-colors"
                     >
                        {item}
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </div>
   );
}
