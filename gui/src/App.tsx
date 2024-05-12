import SettingsSidebar from "./components/settings-sidebar";
import ImageSources from "./components/image-sources";
import AtlasPreview from "./components/atlas-preview";
import AtlasOutput from "./components/atlas-output";
import useStore from "./store/store";

const App = () => {
  const inputPaths = useStore((state) => state.inputPaths);

  return (
    <div className="w-full flex min-h-screen bg-slate-800 text-white gap-4 p-2">
      <SettingsSidebar />
      <ImageSources />
      {inputPaths.length > 0 && (
        <div className="flex flex-col gap-2">
          <AtlasPreview />
          <AtlasOutput />
        </div>
      )}
    </div>
  );
};

export default App;
