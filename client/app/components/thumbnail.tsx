import { Link } from "react-router";

export function Thumbnail({ videoName }: { videoName: string }) {
   return (
      <Link
         to={`/videos/${videoName}`}
         className="bg-transparent overflow-hidden cursor-pointer w-full md:w-64"
      >
         <video
            src={`/api/videos/${videoName}`}
            muted
            className="block w-64 h-44 transition duration-200 ease-in-out hover:scale-105 hover:shadow-2xl object-fill"
         />
         <p className="pt-2 text-sm text-ellipsis max-w-2xs overflow-hidden whitespace-nowrap">
            {videoName}
         </p>
      </Link>
   );
}
