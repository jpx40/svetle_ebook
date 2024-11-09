use std::{
    collections::HashMap,
    fs::File,
    io::{Read, Write},
};
//use actix_web::services;
use anyhow::anyhow;
use serde::{Deserialize, Serialize};
use serde_json::Value;
#[derive(Serialize, Deserialize, Clone)]
pub struct Books {
    pub books: HashMap<String, Book>,
}
#[derive(Serialize, Deserialize, Clone)]
pub struct Book {
    pub name: String,
}

#[derive(Clone, serde::Serialize, Deserialize)]
pub struct FilePayload {
    pub file: String,
}

#[derive(Serialize, Deserialize)]
pub struct Status {
    pub status: String,
    pub content: String,
}
#[derive(Serialize, Deserialize)]
pub struct ParamsFile {
    pub name: String,
}
