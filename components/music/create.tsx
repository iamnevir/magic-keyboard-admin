import { z } from "zod";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { CreateUpdateModal } from "../create-update-modal";
export interface musicFormProps {
  initialData: Doc<"music"> | null;
}

export const formSchema = z.object({
  name: z.string().min(1, { message: "Tên nhạc không được để trống!" }),
  url: z.string(),
});

export type musicFormValues = z.infer<typeof formSchema>;

const Createmusic = () => {
  const defaultValues = {
    name: "",
    url: "",
  };
  const music = {
    _id: "" as Id<"music">,
    _creationTime: 0,
    url: "",
    name: "",
  };
  const createForm = CreateUpdateModal<"music", musicFormValues>(
    music,
    defaultValues,
    formSchema,
    api.music.create,
    api.music.update,
    "Musics",
    false
  );
  return createForm;
};

export default Createmusic;
