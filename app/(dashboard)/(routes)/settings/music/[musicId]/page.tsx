"use client";
import Createmusic from "@/components/music/create";
import Updatemusic from "@/components/music/update";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

const MusicPage = ({ params }: { params: { musicId: Id<"music"> } }) => {
  try {
    const music = useQuery(api.music.getMusicById, {
      musicId: params.musicId,
    });
    if (music === undefined) {
      return (
        <div className="pl-5 pt-5 flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      );
    }
    if (music === null) {
      return <div>Not found</div>;
    }

    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          <Updatemusic music={music} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-x-4 p-8 pt-6">
          {" "}
          <Createmusic />{" "}
        </div>
      </div>
    );
  }
};

export default MusicPage;
