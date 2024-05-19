import { useEffect } from "react";
import useStore from "../store/store";
import { z } from "zod";

const settingsSchema = z.object({
  padding: z.number().nonnegative(),
  atlasWidth: z.number().min(1).optional(),
  atlasHeight: z.number().min(1).optional(),
  autoSize: z.boolean(),
  unified: z.boolean(),
});

const SettingsSidebar = () => {
  const padding = useStore((state) => state.padding);
  const atlasWidth = useStore((state) => state.atlasWidth);
  const atlasHeight = useStore((state) => state.atlasHeight);
  const autoSize = useStore((state) => state.autoSize);
  const inputPaths = useStore((state) => state.inputPaths);
  const unified = useStore((state) => state.unified);

  const generateAtlas = useStore((state) => state.generateAtlas);
  const { setPadding, setAtlasWidth, setAtlasHeight, setAutoSize, setUnified } =
    useStore();

  useEffect(() => {
    if (inputPaths.length === 0) return;

    const result = settingsSchema.safeParse({
      atlasWidth: autoSize ? undefined : atlasWidth,
      atlasHeight: autoSize ? undefined : atlasHeight,
      padding,
      autoSize,
      unified,
    });

    console.log(result);

    if (!result.success) {
      alert("Invalid settings");
      return;
    }

    generateAtlas();
  }, [padding, atlasWidth, atlasHeight, autoSize, inputPaths, unified]);

  return (
    <div className="flex flex-col w-64 h-full text-white p-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <div className="flex flex-col mt-4">
        {!autoSize && (
          <>
            <label className="font-semibold">Atlas width</label>
            <input
              type="number"
              min={1}
              className="p-2 bg-slate-700 text-white"
              value={atlasWidth}
              onChange={(e) => setAtlasWidth(parseInt(e.target.value))}
            />
            <label className="font-semibold mt-2">Atlas height</label>
            <input
              type="number"
              min={1}
              className="p-2 bg-slate-700 text-white"
              value={atlasHeight}
              onChange={(e) => setAtlasHeight(parseInt(e.target.value))}
            />
          </>
        )}
        <label className="font-semibold mt-2">Padding</label>
        <input
          type="number"
          min={0}
          className="p-2 bg-slate-700 text-white"
          value={padding}
          onChange={(e) =>
            setPadding(Math.max(0, parseInt(e.target.value) || 0))
          }
        />
        <label className="font-semibold mt-2">Auto size</label>
        <input
          type="checkbox"
          className="p-2 bg-slate-700 text-white"
          checked={autoSize}
          onChange={(e) => setAutoSize(e.target.checked)}
        />
        <label className="font-semibold mt-2">Unified</label>
        <input
          type="checkbox"
          className="p-2 bg-slate-700 text-white"
          checked={unified}
          onChange={(e) => setUnified(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default SettingsSidebar;
