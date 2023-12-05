"use client";
import { Check, ChevronsUpDown, Edit, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "../ui/skeleton";

const MusicManager = () => {
  const router = useRouter();
  const musics = useQuery(api.music.getMusics);
  const remove = useMutation(api.music.remove);
  const createNew = useMutation(api.musicBackground.create);
  const bgMusic = useQuery(api.musicBackground.getMusicBgs);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Id<"music"> | null>(null);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (bgMusic) {
      setValue(bgMusic?.music!);
      setDisable(true);
    }
  }, [bgMusic]);
  if (bgMusic === undefined) {
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
  return (
    <div className="flex items-center justify-between px-6 w-full">
      <div className=" ">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disable}>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="sm:w-[50vw] justify-between "
            >
              {value
                ? musics?.find((music) => music._id === value)?.name
                : "Chọn nhạc..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="sm:w-[50vw] p-0">
            <Command className="">
              <CommandInput placeholder="Search framework..." />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {musics?.map((music) => (
                  <CommandItem
                    key={music._id}
                    value={music._id}
                    className=" gap-3"
                    onSelect={(currentValue) => {
                      setValue(
                        currentValue === value
                          ? null
                          : (currentValue as Id<"music">)
                      );
                      setOpen(false);
                      setDisable(true);
                      createNew({ musicId: music._id });
                    }}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === music._id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {music.name}

                    <div className="ml-auto flex items-center gap-3">
                      <audio controls className="z-50">
                        <source src={music.url} type="audio/mpeg" />
                      </audio>
                      <Edit
                        className=" cursor-pointer hover:scale-110"
                        onClick={() =>
                          router.push(`/settings/music/${music._id}`)
                        }
                      />
                      <Trash2
                        className=" cursor-pointer hover:scale-110"
                        onClick={() => remove({ id: music._id })}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Button
          className={cn(!disable ? "hidden" : "", "mr-5")}
          variant="primary"
          onClick={() => setDisable(false)}
        >
          Sửa
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push("/settings/music/new")}
        >
          Thêm nhạc
        </Button>
      </div>
    </div>
  );
};

export default MusicManager;
