use clap::Parser;
use shared::{pack_images, pack_images_auto_size, save_image};

#[derive(Parser, Debug)]
#[clap(
    name = "tiny_packer",
    version = "0.1.0",
    author = "Gabriel Kaszewski",
    about = "A tiny texture packer"
)]
struct Args {
    #[clap(
        short,
        long,
        help = "Input files",
        required = true,
        number_of_values = 1
    )]
    input: Vec<String>,
    #[clap(short, long, help = "Output file", required = true)]
    output: String,
    #[clap(long, default_value = "512", help = "Atlas width")]
    width: u32,
    #[clap(long, default_value = "512", help = "Atlas height")]
    height: u32,
    #[clap(short, long, default_value = "0", help = "Padding")]
    padding: u32,
    #[clap(
        short,
        long,
        default_value = "true",
        help = "Automatically calculate image dimensions"
    )]
    auto_size: bool,
}

fn main() {
    let args = Args::parse();
    let paths = args.input.iter().map(|s| s.as_str()).collect();
    let atlas_width = args.width;
    let atlas_height = args.height;
    let output_path = args.output;
    let padding = args.padding;
    let auto_size = args.auto_size;

    let atlas_image_result = if auto_size {
        pack_images_auto_size(paths, padding)
    } else {
        pack_images(paths, atlas_width, atlas_height, padding)
    };

    let atlas_image = match atlas_image_result {
        Ok(image) => image,
        Err(e) => {
            eprintln!("Error packing images: {}", e);
            return;
        }
    };

    if let Ok(_) = save_image(&atlas_image, &output_path) {
        println!("Atlas saved to {}", output_path);
    } else {
        eprintln!("Error saving atlas");
    }
}
