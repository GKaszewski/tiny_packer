import { useEffect } from "react";
import useStore from "../store/store";
import { open } from "@tauri-apps/api/dialog";
import { useHotkeys } from "react-hotkeys-hook";

const ImageSources = () => {
  const imagesBase64Data = useStore((state) => state.imagesBase64Data);
  const imagePaths = useStore((state) => state.inputPaths);
  const loadImages = useStore((state) => state.loadImages);
  const setInputPaths = useStore((state) => state.setInputPaths);
  const isLoadingImages = useStore((state) => state.isLoadingImages);
  const addInputPaths = useStore((state) => state.addInputPaths);
  const clearImages = useStore((state) => state.clearImages);
  const generateAtlas = useStore((state) => state.generateAtlas);

  useEffect(() => {
    if (imagePaths.length === 0) return;
    generateAtlas();
  }, [imagePaths]);

  const handleOpenFiles = async () => {
    const result = await open({
      multiple: true,
      filters: [
        {
          name: "Images",
          extensions: ["png", "jpg", "jpeg"],
        },
      ],
    });

    if (Array.isArray(result)) {
      setInputPaths(result);
      loadImages(result);
    } else if (result !== null) {
      setInputPaths([result]);
    }
  };

  const handleAddImages = async () => {
    const result = await open({
      multiple: true,
      filters: [
        {
          name: "Images",
          extensions: ["png", "jpg", "jpeg"],
        },
      ],
    });

    if (Array.isArray(result)) {
      addInputPaths(result);
    } else if (result !== null) {
      addInputPaths([result]);
    }
  };

  useHotkeys("ctrl+i", handleOpenFiles);
  useHotkeys("ctrl+shift+i", handleAddImages);
  useHotkeys("ctrl+shift+c", clearImages);

  return (
    <div className="flex flex-col w-fit min-w-[20rem] bg-slate-700 p-4">
      <div className="flex flex-col w-full">
        <h1 className="text-xl font-bold">Image sources</h1>
        <div className="flex">
          <button
            className="p-2 bg-slate-800 text-white mt-4"
            onClick={handleOpenFiles}
          >
            Import images
          </button>
          {imagePaths.length > 0 && (
            <>
              <button
                className="p-2 bg-slate-800 text-white mt-4 ml-4"
                onClick={clearImages}
              >
                Clear images
              </button>
              <button
                className="p-2 bg-slate-800 text-white mt-4 ml-4"
                onClick={handleAddImages}
              >
                Add images
              </button>
            </>
          )}
        </div>
        {!isLoadingImages && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {imagesBase64Data.map((base64Data, index) => (
              <img key={index} src={base64Data} alt={`Image ${index}`} />
            ))}
          </div>
        )}

        {isLoadingImages && <p>Loading images...</p>}
      </div>
      <div className="flex flex-col w-full">
        <h1 className="text-xl font-bold">Image paths</h1>
        <ul className="mt-4 max-h-[10rem] overflow-y-auto">
          {imagePaths.map((path, index) => (
            <li key={index}>{path}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImageSources;
