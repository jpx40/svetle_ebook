use quick_xml::encoding::EncodingError;
use quick_xml::events::attributes::AttrError;
use quick_xml::events::{BytesStart, Event};
use quick_xml::name::QName;
use quick_xml::reader::Reader;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::collections::HashMap;
use std::convert::Infallible;
use std::path::{Path, PathBuf};
use std::str;
use std::sync::Mutex;

use std::fs::File;
use std::io::Read;
use walkdir::WalkDir;
lazy_static::lazy_static! {

    pub static ref BOOKS: Mutex<HashMap<String,BookMeta>> = Mutex::new(HashMap::new());

}

const XML: &str = r#"
<?xml version="1.0" encoding="utf-8"?>
  <DefaultSettings Language="es" Greeting="HELLO"/>
  <Localization>
    <Translation Tag="HELLO" Language="ja">
      <Text>こんにちは</Text>
    </Translation>
    <Translation Tag="BYE" Language="ja">
      <Text>さようなら</Text>
    </Translation>
    <Translation Tag="HELLO" Language="es">
      <Text>Hola</Text>
    </Translation>
    <Translation Tag="BYE" Language="es">
      <Text>Adiós</Text>
    </Translation>
    <meta ame="cover Content="path"></meta>

  </Localization>
"#;

// Enum variants is not read in example, so suppress the warning
#[allow(dead_code)]
#[derive(Debug)]
enum AppError {
    /// XML parsing error
    Xml(quick_xml::Error),
    /// The `Translation/Text` node is missed
    NoText(String),
}

impl From<quick_xml::Error> for AppError {
    fn from(error: quick_xml::Error) -> Self {
        Self::Xml(error)
    }
}

impl From<AttrError> for AppError {
    fn from(error: AttrError) -> Self {
        Self::Xml(quick_xml::Error::InvalidAttr(error))
    }
}
impl From<EncodingError> for AppError {
    fn from(error: EncodingError) -> Self {
        Self::Xml(quick_xml::Error::Encoding(error))
    }
}

#[derive(Debug)]
struct Translation {
    tag: String,
    lang: String,
    text: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Meta {
    pub name: String,
    pub content: String,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookMeta {
    pub title: String,
    pub cover: Meta,
    pub path: String,
    pub url: Option<String>,
}
impl Translation {
    fn new_from_element(
        reader: &mut Reader<&[u8]>,
        element: BytesStart,
    ) -> Result<Translation, AppError> {
        let mut tag = Cow::Borrowed("");
        let mut lang = Cow::Borrowed("");

        for attr_result in element.attributes() {
            let a = attr_result?;
            match a.key.as_ref() {
                b"Language" => lang = a.decode_and_unescape_value(reader.decoder())?,
                b"Tag" => tag = a.decode_and_unescape_value(reader.decoder())?,
                _ => (),
            }
        }
        let mut element_buf = Vec::new();
        let event = reader.read_event_into(&mut element_buf)?;

        if let Event::Start(ref e) = event {
            let name = e.name();
            if name == QName(b"Text") {
                // note: `read_text` does not support content as CDATA
                let text_content = reader.read_text(e.name())?;
                Ok(Translation {
                    tag: tag.into(),
                    lang: lang.into(),
                    text: text_content.into(),
                })
            } else {
                dbg!("Expected Event::Start for Text, got: {:?}", &event);
                let name_string = reader.decoder().decode(name.as_ref())?;
                Err(AppError::NoText(name_string.into()))
            }
        } else {
            let event_string = format!("{:?}", event);

            Err(AppError::NoText(event_string))
        }
    }
}
impl Meta {
    fn new_from_element(
        reader: &mut Reader<&[u8]>,
        element: BytesStart,
    ) -> anyhow::Result<Meta, AppError> {
        let mut name2 = Cow::Borrowed("");
        let mut content = Cow::Borrowed("");

        for attr_result in element.attributes() {
            let a = attr_result?;
            match a.key.as_ref() {
                b"name" => name2 = a.decode_and_unescape_value(reader.decoder())?,
                b"content" => content = a.decode_and_unescape_value(reader.decoder())?,
                _ => (),
            }
        }
        let mut element_buf = Vec::new();
        let event = reader.read_event_into(&mut element_buf)?;

        // if let Event::Start(ref e) = event {
        //     let name = e.name();
        //     if name == QName(b"Text") {
        //         // note: `read_text` does not support content as CDATA
        //         let text_content = reader.read_text(e.name())?;
        //         Ok(Meta {
        //             name: name2.into(),
        //             content: content.into(),
        //         })
        //     } else {
        //         dbg!("Expected Event::Start for Text, got: {:?}", &event);
        //         let name_string = reader
        //             .decoder()
        //             .decode(name.as_ref())
        //             .map_err(quick_xml::Error::Encoding)?;
        //         Err(AppError::NoText(name_string.into()))
        //     }
        // } else {
        //     let event_string = format!("{:?}", event);
        //     Err(AppError::NoText(event_string))
        // }
        Ok(Meta {
            name: name2.into(),
            content: content.into(),
        })
    }
}

fn check(buf_xml: &str) -> anyhow::Result<BookMeta, AppError> {
    // In a real-world use case, Settings would likely be a struct
    // HashMap here is just to make the sample code short
    let mut settings: HashMap<String, String>;
    let mut translations: Vec<Translation> = Vec::new();
    let xml = r#" <dc:title>
    Test
    </dc:title>
    <meta name="cover" content="path"> </meta>"#;
    let mut reader = Reader::from_str(buf_xml);
    let config = reader.config_mut();

    config.trim_text(true);
    // == Handling empty elements ==
    // To simply our processing code
    // we want the same events for empty elements, like:
    //   <DefaultSettings Language="es" Greeting="HELLO"/>
    //   <Text/>
    config.expand_empty_elements = true;

    let mut buf = Vec::new();
    let mut meta = Vec::new();
    let mut tag_count = 0;
    let mut title = String::new();
    loop {
        let event = reader.read_event_into(&mut buf)?;
        //tag_count += 1;
        // if let Ok(mut g_c) = COUNT.lock() {
        //     *g_c += 1;
        // }
        match event {
            Event::Start(element) => match element.name().as_ref() {
                b"DefaultSettings" => {
                    // Note: real app would handle errors with good defaults or halt program with nice message
                    // This illustrates decoding an attribute's key and value with error handling
                    settings = element
                        .attributes()
                        .map(|attr_result| {
                            match attr_result {
                                Ok(a) => {
                                    let key = reader.decoder().decode(a.key.local_name().as_ref())
                                        .or_else(|err| {
                                            dbg!("unable to read key in DefaultSettings attribute {:?}, utf8 error {:?}", &a, err);
                                            Ok::<Cow<'_, str>, Infallible>(std::borrow::Cow::from(""))
                                        })
                                        .unwrap().to_string();
                                    let value = a.decode_and_unescape_value(reader.decoder()).or_else(|err| {
                                            dbg!("unable to read key in DefaultSettings attribute {:?}, utf8 error {:?}", &a, err);
                                            Ok::<Cow<'_, str>, Infallible>(std::borrow::Cow::from(""))
                                    }).unwrap().to_string();
                                    (key, value)
                                },
                                Err(err) => {
                                     dbg!("unable to read key in DefaultSettings, err = {:?}", err);
                                    (String::new(), String::new())
                                }
                            }
                        })
                        .collect();
                    // assert_eq!(settings["Language"], "es");
                    // assert_eq!(settings["Greeting"], "HELLO");
                    reader.read_to_end(element.name())?;
                }
                b"Translation" => {
                    translations.push(Translation::new_from_element(&mut reader, element)?);
                }
                b"meta" => {
                    meta.push(Meta::new_from_element(&mut reader, element)?);
                }
                b"dc:title" => {
                    title = reader.read_text(element.name()).clone()?.to_string();
                }
                _ => (),
            },

            Event::Eof => break, // exits the loop when reaching end of file
            _ => (),             // There are `Event` types not considered here
        }
    }

    let cover = {
        let m: Vec<Meta> = meta.into_iter().filter(|x| x.name == "cover").collect();
        m[0].clone()
    };

    // assert_eq!(translations.len(), 4);
    // assert_eq!(translations[2].tag, "HELLO");
    // assert_eq!(translations[2].text, "Hola");
    // assert_eq!(translations[2].lang, "es");

    Ok(BookMeta {
        title,
        cover,
        path: "".to_string(),
        url: None,
    })
}

pub fn get_meta(book_path: String) {
    let mut buf = String::new();
    let mut parent_path = PathBuf::new();
    let mut path: String = String::new();
    let walker = WalkDir::new(&book_path);
    for e in walker {
        let e = e.unwrap();

        if e.path().is_file() {
            if e.path().to_str().unwrap().contains("content.opf") {
                path = e.path().as_os_str().to_string_lossy().to_string();
                parent_path = e.path().parent().unwrap().to_path_buf();

                break;
            }
        }
    }

    let mut file = File::open(&path).unwrap();
    file.read_to_string(&mut buf).unwrap();
    let meta = {
        let res = check(&buf).unwrap();

        let cover_path = {
            let p = Path::new(&res.cover.content);
            parent_path.join(p).to_string_lossy().to_string()
        };
        BookMeta {
            title: res.title,
            cover: Meta {
                name: res.cover.name,
                content: cover_path,
            },
            path: book_path,
            url: res.url,
        }
    };

    {
        if let Ok(mut books) = BOOKS.try_lock() {
            let k = meta.title.replace(" ", "_");
            if !books.contains_key(&k) {
                books.insert(k, meta);
            }
        }
    }
}
