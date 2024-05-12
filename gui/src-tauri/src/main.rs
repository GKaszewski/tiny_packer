// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::create_atlas_command,
            commands::load_image_command,
            commands::load_images_command,
            commands::save_atlas_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
