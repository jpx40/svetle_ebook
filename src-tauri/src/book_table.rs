use std::fs;
use std::io;
use std::io::Read;
use std::io::Write;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;


const   TMP_DIR: &str = "./tmp";
pub fn extract(p: PathBuf, out_path: &str) {
    let file = fs::File::open(&p).unwrap();

    let mut archive = zip::ZipArchive::new(file).unwrap();
    let p_file_name = p.file_name().unwrap().to_str().unwrap();

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).unwrap();
        let filename = match file.enclosed_name() {
            Some(path) => path,
            None => continue,
        };

        let outpath_tmp = out_path.to_string() + p_file_name + "/" + filename.to_str().unwrap();

        //    println!("{}", &outpath_tmp);
        let outpath = PathBuf::from(outpath_tmp);
        {
            let comment = file.comment();
            if !comment.is_empty() {
                //     println!("File {i} comment: {comment}");
            }
        }

        if file.is_dir() {
            // println!("File {} extracted to \"{}\"", i, outpath.display());
            fs::create_dir_all(&outpath).unwrap();
        } else {
            if let Some(p) = outpath.parent() {
                let mut file = std::fs::File::create("t.txt").unwrap();
                file.write_all(p.to_str().unwrap().as_bytes()).unwrap();
                if !p.exists() {
                    fs::create_dir_all(p).unwrap();
                }
            }
            let mut outfile = fs::File::create(&outpath).unwrap();
            io::copy(&mut file, &mut outfile).unwrap();
        }

        // Get and Set permissions
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;

            if let Some(mode) = file.unix_mode() {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(mode)).unwrap();
            }
        }
    }
    let outpath_tmp = out_path.to_string() + p_file_name + "/";
    crate::cover::get_meta(outpath_tmp);
}

pub fn unpack(p: &Path, out_path: &str) {
    
    
    if !Path::new(TMP_DIR).exists() {
        fs::create_dir(TMP_DIR).unwrap();
        
    }
    if p.is_dir() {
        for entry in WalkDir::new(p) {
            let entry = entry.unwrap();
            if entry.path().is_file() {
                if entry.path().to_str().unwrap().contains(" ") {
                    let path = crate::util::trim_filename(
                        entry.path().canonicalize().unwrap().to_str().unwrap(),
                    )
                    .unwrap();
                    let path = Path::new(&path);
                    if let Some(ext) = path.extension() {
                        if "epub" == ext {
                            let path = path.canonicalize().unwrap();
                            // let o = crate::util::trim_filename(
                            //     &out_path
                            // ).unwrap();
                            extract(path, &out_path);
                        } else {
                            println!("no epub");
                        }
                    } else {
                        println!("no epub");
                    }
                } else {
                    if let Some(ext) = entry.path().extension() {
                        if "epub" == ext {
                            let path = entry.path().canonicalize().unwrap();
                            extract(path, out_path);
                        } else {
                            println!("no epub");
                        }
                    } else {
                        println!("no epub");
                    }
                }
            }
        }
    } else {
        if let Some(ext) = p.extension() {
            if "epub" == ext {
                let path = p.canonicalize().unwrap();
                extract(path, out_path);
            }
        }
    }
}

fn correct_filename() {}
