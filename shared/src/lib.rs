use image::{DynamicImage, GenericImageView, ImageError, RgbaImage};

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Rect {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
}

pub struct Atlas {
    pub width: u32,
    pub height: u32,
    pub rects: Vec<Rect>,
}

impl Atlas {
    pub fn new(width: u32, height: u32) -> Self {
        Atlas {
            width,
            height,
            rects: Vec::new(),
        }
    }

    pub fn add_rect(&mut self, width: u32, height: u32, padding: u32) -> Option<Rect> {
        let mut y = padding;
        while y + height + padding <= self.height {
            let mut x = padding;
            while x + width + padding <= self.width {
                if self.is_free_space(x, y, width, height, padding) {
                    let rect = Rect {
                        x,
                        y,
                        width,
                        height,
                    };
                    self.rects.push(rect.clone());
                    return Some(rect);
                }
                x += 1;
            }
            y += 1;
        }
        None
    }

    fn is_free_space(&self, x: u32, y: u32, width: u32, height: u32, padding: u32) -> bool {
        for rect in &self.rects {
            if x + width + padding > rect.x
                && x < rect.x + rect.width + padding
                && y + height + padding > rect.y
                && y < rect.y + rect.height + padding
            {
                return false;
            }
        }
        true
    }
}

pub fn load_image(path: &str) -> Result<DynamicImage, ImageError> {
    image::open(path)
}

pub fn save_image(image: &RgbaImage, path: &str) -> Result<(), ImageError> {
    image.save(path)
}

pub fn pack_images(
    paths: Vec<&str>,
    atlas_width: u32,
    atlas_height: u32,
    padding: u32,
) -> Result<RgbaImage, ImageError> {
    let mut atlas = Atlas::new(atlas_width, atlas_height);
    let mut final_image = RgbaImage::new(atlas_width, atlas_height);

    for path in paths {
        let image = load_image(path)?;
        let (width, height) = image.dimensions();
        if let Some(rect) = atlas.add_rect(width, height, padding) {
            image::imageops::overlay(
                &mut final_image,
                &image.to_rgba8(),
                rect.x.into(),
                rect.y.into(),
            );
        } else {
            eprintln!("Atlas is too small to fit all images");
        }
    }

    Ok(final_image)
}

pub fn pack_images_auto_size(paths: Vec<&str>, padding: u32) -> Result<RgbaImage, ImageError> {
    let mut width = 0;
    let mut height = 0;
    let images: Vec<RgbaImage> = paths
        .iter()
        .map(|path| load_image(path).map(|image| image.to_rgba8()))
        .collect::<Result<Vec<RgbaImage>, ImageError>>()?;

    for image in &images {
        let (image_width, image_height) = image.dimensions();
        width = width.max(image_width + padding * 2);
        height = height.max(image_height + padding * 2);
    }

    let images_count = images.len() as u32;
    width = (images_count as f32).sqrt().ceil() as u32 * width;
    height = (images_count as f32).sqrt().ceil() as u32 * height;

    let mut atlas = Atlas::new(width, height);
    let mut final_image = RgbaImage::new(width, height);

    for (_, image) in paths.iter().zip(images) {
        let (width, height) = image.dimensions();
        if let Some(rect) = atlas.add_rect(width, height, padding) {
            image::imageops::overlay(&mut final_image, &image, rect.x.into(), rect.y.into());
        } else {
            eprintln!("Atlas is too small to fit all images");
        }
    }

    Ok(final_image)
}

pub fn pack_images_auto_size_unified(
    paths: Vec<&str>,
    padding: u32,
) -> Result<RgbaImage, ImageError> {
    let mut width = 0;
    let mut height = 0;
    let images: Vec<RgbaImage> = paths
        .iter()
        .map(|path| load_image(path).map(|image| image.to_rgba8()))
        .collect::<Result<Vec<RgbaImage>, ImageError>>()?;

    for image in &images {
        let (image_width, image_height) = image.dimensions();
        width = width.max(image_width + padding * 2);
        height = height.max(image_height + padding * 2);
    }

    let image_width = width;
    let image_height = height;

    let images_count = images.len() as u32;
    width = images_count * width + padding * 2;
    height = images_count * height + padding * 2;

    println!(
        "width: {}, height: {}, images_count: {}, padding: {}, image_width: {}, image_height: {}",
        width, height, images_count, padding, image_width, image_height
    );

    let mut atlas = Atlas::new(width, height);
    let mut final_image = RgbaImage::new(width, height);

    for (_, image) in paths.iter().zip(images) {
        if let Some(rect) = atlas.add_rect(image_width, image_height, padding) {
            image::imageops::overlay(&mut final_image, &image, rect.x.into(), rect.y.into());
        } else {
            eprintln!("Atlas is too small to fit all images");
        }
    }

    Ok(final_image)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_atlas() {
        let mut atlas = Atlas::new(10, 10);
        assert_eq!(
            atlas.add_rect(5, 5, 0),
            Some(Rect {
                x: 0,
                y: 0,
                width: 5,
                height: 5
            })
        );
        assert_eq!(
            atlas.add_rect(5, 5, 0),
            Some(Rect {
                x: 5,
                y: 0,
                width: 5,
                height: 5
            })
        );
        assert_eq!(
            atlas.add_rect(5, 5, 0),
            Some(Rect {
                x: 0,
                y: 5,
                width: 5,
                height: 5
            })
        );
        assert_eq!(
            atlas.add_rect(5, 5, 0),
            Some(Rect {
                x: 5,
                y: 5,
                width: 5,
                height: 5
            })
        );
        assert_eq!(atlas.add_rect(5, 5, 0), None);
    }

    #[test]
    fn test_pack_images() {
        let paths = vec!["tests/images/1.png", "tests/images/2.png"];
        let image = pack_images(paths, 10, 10, 0).unwrap();
        assert_eq!(image.dimensions(), (10, 10));
    }
}
