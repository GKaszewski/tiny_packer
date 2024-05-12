import useStore from "../store/store";

const AtlasPreview = () => {
  const previewAtlas = useStore((state) => state.previewAtlas);
  const isGeneratingAtlas = useStore((state) => state.isGeneratingAtlas);

  return (
    <div className="flex flex-col w-full min-h-[10rem] bg-slate-700 p-4">
      <div className="flex flex-col w-full">
        <h1 className="text-xl font-bold">Atlas preview</h1>
      </div>
      {isGeneratingAtlas && <p>Generating atlas...</p>}
      {previewAtlas && (
        <img src={previewAtlas} alt="Atlas preview" className="mt-4" />
      )}
    </div>
  );
};

export default AtlasPreview;
