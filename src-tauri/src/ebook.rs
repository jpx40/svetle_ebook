use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

pub fn find_cover_path(p: &Path) -> Option<PathBuf> {
    for entry in WalkDir::new(p) {
        let entry = entry.unwrap();
        if entry.path().is_file() {
            if entry
                .path()
                .file_name()
                .unwrap()
                .to_str()
                .unwrap()
                .contains("cover")
                || entry
                    .path()
                    .file_name()
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .contains("Cover")
            {
                return Some(entry.path().to_path_buf());
            }
        }
    }
    None
}
