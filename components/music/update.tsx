import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { musicFormValues, formSchema } from "./create";
import { CreateUpdateModal } from "../create-update-modal";

const Updatemusic = ({ music }: { music: Doc<"music"> }) => {
  const defaultValues = {
    name: music.name,
    url: music.url,
  };
  const UpdateForm = CreateUpdateModal<"music", musicFormValues>(
    music,
    defaultValues,
    formSchema,
    api.music.create,
    api.music.update,
    "Musics",
    true
  );
  return UpdateForm;
};

export default Updatemusic;
