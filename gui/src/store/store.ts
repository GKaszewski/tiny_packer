import { create } from "zustand";
import { invoke } from "@tauri-apps/api/tauri";

interface State {
  atlasWidth: number;
  atlasHeight: number;
  padding: number;
  autoSize: boolean;
  unified: boolean;
  inputPaths: string[];
  imagesBase64Data: string[];
  previewAtlas: string | null;
  isGeneratingAtlas: boolean;
  isSavingAtlas: boolean;
  isLoadingImages: boolean;
  outputAtlasPath: string;

  loadImages: (paths: string[]) => void;
  generateAtlas: () => void;
  saveAtlas: () => void;
  addInputPaths: (paths: string[]) => void;

  setAtlasWidth: (width: number) => void;
  setAtlasHeight: (height: number) => void;
  setPadding: (padding: number) => void;
  setAutoSize: (autoSize: boolean) => void;
  setUnified: (unified: boolean) => void;
  setInputPaths: (paths: string[]) => void;
  setOutputAtlasPath: (path: string) => void;
  clearImages: () => void;
}

const useStore = create<State>((set, get) => ({
  atlasHeight: 1024,
  atlasWidth: 1024,
  padding: 2,
  autoSize: true,
  unified: true,
  inputPaths: [],
  imagesBase64Data: [],
  previewAtlas: null,
  isGeneratingAtlas: false,
  isSavingAtlas: false,
  isLoadingImages: false,
  outputAtlasPath: "",

  loadImages: async (paths: string[]) => {
    set({ inputPaths: paths, isLoadingImages: true });
    try {
      const imagesBase64Data: string[] = await invoke("load_images_command", {
        paths,
      });
      const imagesBase64DataWithPrefix = imagesBase64Data.map(
        (base64Data) => `data:image/png;base64,${base64Data}`
      );
      set({ imagesBase64Data: imagesBase64DataWithPrefix });
    } catch (e) {
      alert("Failed to load images" + e);
    }
    set({ isLoadingImages: false });
  },
  generateAtlas: async () => {
    set({ isGeneratingAtlas: true });
    try {
      const base64Image: string = await invoke("create_atlas_command", {
        inputPaths: get().inputPaths,
        atlasWidth: get().atlasWidth,
        atlasHeight: get().atlasHeight,
        padding: get().padding,
        autoSize: get().autoSize,
        unified: get().unified,
      });
      set({ previewAtlas: `data:image/png;base64,${base64Image}` });
    } catch (e) {
      console.log("Failed to generate atlas: ", e);
      alert("Failed to generate atlas: " + e);
    }
    set({ isGeneratingAtlas: false });
  },
  saveAtlas: async () => {
    set({ isSavingAtlas: true });
    try {
      await invoke("save_atlas_command", {
        outputPath: get().outputAtlasPath,
        inputPaths: get().inputPaths,
        atlasWidth: get().atlasWidth,
        atlasHeight: get().atlasHeight,
        padding: get().padding,
        autoSize: get().autoSize,
        unified: get().unified,
      });
    } catch (e) {
      console.log("Failed to save atlas: ", e);
      alert("Failed to save atlas" + e);
    }
    set({ isSavingAtlas: false });
  },
  addInputPaths: async (paths: string[]) => {
    const inputPaths = get().inputPaths;
    inputPaths.push(...paths);
    set({ inputPaths, isLoadingImages: true });
    try {
      const imagesBase64Data: string[] = await invoke("load_images_command", {
        paths: inputPaths,
      });
      const imagesBase64DataWithPrefix = imagesBase64Data.map(
        (base64Data) => `data:image/png;base64,${base64Data}`
      );
      set({
        imagesBase64Data: imagesBase64DataWithPrefix,
        isLoadingImages: false,
      });
    } catch (e) {
      set({ isLoadingImages: false });
      alert("Failed to load images" + e);
    }
  },

  setAtlasWidth: (width: number) => set({ atlasWidth: width }),
  setAtlasHeight: (height: number) => set({ atlasHeight: height }),
  setPadding: (padding: number) => set({ padding }),
  setAutoSize: (autoSize: boolean) => set({ autoSize }),
  setUnified: (unified: boolean) => set({ unified }),
  setInputPaths: (paths: string[]) => set({ inputPaths: paths }),
  setOutputAtlasPath: (path: string) => set({ outputAtlasPath: path }),
  clearImages: () => set({ imagesBase64Data: [], inputPaths: [] }),
}));

export default useStore;
