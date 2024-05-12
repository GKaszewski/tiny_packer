import useStore from "../store/store";
import { dialog } from "@tauri-apps/api";
import { useHotkeys } from "react-hotkeys-hook";

const AtlasOutput = () => {
  const outputAtlasPath = useStore((state) => state.outputAtlasPath);
  const saveAtlas = useStore((state) => state.saveAtlas);
  const isSavingAtlas = useStore((state) => state.isSavingAtlas);
  const setOutputAtlasPath = useStore((state) => state.setOutputAtlasPath);

  const handleSaveAtlas = () => {
    saveAtlas();
  };

  const handleOpenDialog = async () => {
    const result = await dialog.save({
      defaultPath: outputAtlasPath,
      filters: [{ name: "Images", extensions: ["png"] }],
    });

    if (result) {
      setOutputAtlasPath(result);
    }

    handleSaveAtlas();
  };

  useHotkeys("ctrl+s", handleOpenDialog);

  return (
    <div className="flex w-full h-fit bg-slate-700 p-4">
      <div className="flex flex-col w-full">
        <h1 className="text-xl font-bold">Atlas output</h1>
        {isSavingAtlas && <p>Saving atlas...</p>}
        {!isSavingAtlas && (
          <button
            className="p-2 bg-slate-800 text-white mt-4"
            onClick={handleOpenDialog}
          >
            Save atlas
          </button>
        )}
      </div>
    </div>
  );
};

export default AtlasOutput;
