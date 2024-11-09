use std::fs;
use std::path::Path;
pub fn trim_filename(old: &str) -> std::io::Result<String> {
    let new = old.replace(" ", "_");

    if !Path::new(&new).exists() {
        fs::copy(old, &new)?;
    }
    Ok(new)
}
