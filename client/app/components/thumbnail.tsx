import { Link } from "react-router";

export function Thumbnail({
   videoName,
   uploadedAt,
}: {
   videoName: string;
   uploadedAt: Date;
}) {
   return (
      <Link
         to={`/videos/${videoName}`}
         className="bg-transparent overflow-hidden cursor-pointer w-full md:w-64"
      >
         <video
            src={`/api/videos/${videoName}`}
            muted
            className="block w-full h-44 transition duration-200 ease-in-out hover:scale-105 hover:shadow-2xl object-fill"
         />
         <div className="flex flex-row justify-between pt-2">
            <p className="text-sm text-ellipsis max-w-3/4 overflow-hidden whitespace-nowrap">
               {videoName}
            </p>
            <p className="text-sm">{uploadedAt.toLocaleDateString()}</p>
         </div>
      </Link>
   );
}
