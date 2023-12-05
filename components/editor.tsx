import { Editor as NovelEditor } from "novel";
import { Editor as Edit } from "@tiptap/core";
export default function Editor({
  value,
  onChange,
}: {
  value?: Edit;
  onChange: (editor?: Edit) => void;
}) {
  return (
    <NovelEditor
      className=" dark:bg-black rounded-md"
      defaultValue={value ? value : ""}
      disableLocalStorage={true}
      onDebouncedUpdate={onChange}
      debounceDuration={2000}
    />
  );
}
