use base64::{engine::general_purpose, Engine as _};
use shared::{
    load_image, pack_images, pack_images_auto_size, pack_images_auto_size_unified, save_image,
};
use std::io::Cursor;

#[tauri::command]
pub fn create_atlas_command(
    input_paths: Vec<String>,
    atlas_width: u32,
    atlas_height: u32,
    padding: u32,
    auto_size: bool,
    unified: bool,
) -> Result<String, String> {
    let paths = input_paths.iter().map(|s| s.as_str()).collect();
    let atlas_image_result = match (auto_size, unified) {
        (true, true) => pack_images_auto_size_unified(paths, padding),
        (true, false) => pack_images_auto_size(paths, padding),
        (false, _) => pack_images(paths, atlas_width, atlas_height, padding),
    };

    atlas_image_result
        .map_err(|e| e.to_string())
        .and_then(|image| {
            let mut bytes = Cursor::new(Vec::new());
            image
                .write_to(&mut bytes, image::ImageFormat::Png)
                .map_err(|e| e.to_string())?;

            Ok(general_purpose::STANDARD.encode(&bytes.into_inner()))
        })
}

#[tauri::command]
pub fn load_image_command(path: String) -> Result<String, String> {
    load_image(&path)
        .map_err(|e| e.to_string())
        .and_then(|image| {
            let mut bytes = Cursor::new(Vec::new());
            image
                .write_to(&mut bytes, image::ImageFormat::Png)
                .map_err(|e| e.to_string())?;

            Ok(general_purpose::STANDARD.encode(&bytes.into_inner()))
        })
}

#[tauri::command]
pub fn load_images_command(paths: Vec<String>) -> Result<Vec<String>, String> {
    paths
        .iter()
        .map(|path| load_image_command(path.clone()))
        .collect()
}

#[tauri::command]
pub fn save_atlas_command(
    input_paths: Vec<String>,
    output_path: String,
    atlas_width: u32,
    atlas_height: u32,
    padding: u32,
    auto_size: bool,
    unified: bool,
) -> Result<(), String> {
    let paths = input_paths.iter().map(|s| s.as_str()).collect();
    let atlas_image_result = match (auto_size, unified) {
        (true, true) => pack_images_auto_size_unified(paths, padding),
        (true, false) => pack_images_auto_size(paths, padding),
        (false, _) => pack_images(paths, atlas_width, atlas_height, padding),
    };
    if let Ok(image) = atlas_image_result {
        save_image(&image, &output_path).map_err(|e| e.to_string())
    } else {
        Err("Failed to create atlas".to_string())
    }
}
