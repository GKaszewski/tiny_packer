# Tiny packer
**Overview:**
Tiny Packer is a command-line utility designed to combine multiple images into a single texture atlas. It provides options for manual and automatic sizing of the atlas, including adjustable padding between images.

# Features
- CLI 
- GUI 
- Padding support
- Auto size

# How to use? 
## GUI
**Hotkeys**
- `Ctrl+I` - Import images
- `Ctrl+Shift+I` - Add images
- `Ctrl+Shift+C` - Clear images
- `Ctrl+S` - Save generated atlas
## CLI
**Usage:**
```bash
tiny_packer --input <input_files> --output <output_file> [OPTIONS]
```

**Required Arguments:**
- `--input`, `-i`: Specify the input image files. Multiple files can be specified by repeating the argument for each file.
- `--output`, `-o`: Specify the path where the output atlas image will be saved.

**Options:**
- `--width`: Specify the width of the atlas. Defaults to `512` pixels. This option is ignored if auto sizing is enabled.
- `--height`: Specify the height of the atlas. Defaults to `512` pixels. This option is ignored if auto sizing is enabled.
- `--padding`, `-p`: Set the padding between images in the atlas. Defaults to `0` pixels.
- `--auto_size`, `-a`: Enable or disable automatic sizing of the atlas dimensions. Defaults to `true`. When enabled, the atlas dimensions are calculated based on the input images.

**Examples:**

1. **Creating an Atlas with Specified Dimensions:**
   Generate an atlas with a specific width and height, ignoring automatic sizing.
   ```bash
   tiny_packer -i image1.png -i image2.png -o atlas.png --width 1024 --height 1024 -a false
   ```

2. **Creating an Atlas with Automatic Sizing:**
   Generate an atlas where dimensions are automatically calculated.
   ```bash
   tiny_packer -i image1.png -i image2.png -i image3.png -o atlas.png
   ```

3. **Creating an Atlas with Padding:**
   Generate an atlas with a specified padding between images.
   ```bash
   tiny_packer -i image1.png -i image2.png -o atlas.png -p 10
   ```

**Additional Tips:**
- Multiple input files should be specified by repeating the `-i` or `--input` option for each file.
- Ensure that file paths are correctly specified and accessible from the command line.
- For best results, images should be of compatible formats and dimensions when padding and auto sizing are considered.

**Help:**
To view more information and help regarding the command options, you can use the `--help` flag:
```bash
tiny_packer --help
```

# License
MIT