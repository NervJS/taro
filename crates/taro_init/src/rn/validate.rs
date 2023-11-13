use once_cell::sync::Lazy;
use regex::Regex;

static JAVA_KEYWORDS: [&str; 50] = [
  "abstract",
  "continue",
  "for",
  "new",
  "switch",
  "assert",
  "default",
  "goto",
  "package",
  "synchronized",
  "boolean",
  "do",
  "if",
  "private",
  "this",
  "break",
  "double",
  "implements",
  "protected",
  "throw",
  "byte",
  "else",
  "import",
  "public",
  "throws",
  "case",
  "enum",
  "instanceof",
  "return",
  "transient",
  "catch",
  "extends",
  "int",
  "short",
  "try",
  "char",
  "final",
  "interface",
  "static",
  "void",
  "class",
  "finally",
  "long",
  "strictfp",
  "volatile",
  "const",
  "float",
  "native",
  "super",
  "while"
];

static NAME_REGEX: Lazy<Regex> = Lazy::new(|| {
  Regex::new(r#"^(?!_)[$A-Z_][0-9A-Z_$]*$"#).unwrap()
});

static RESERVED_NAMES: Lazy<Vec<&str>> = Lazy::new(|| {
  let mut names = Vec::new();
  names.extend(JAVA_KEYWORDS.iter());
  names.extend(&["react", "react-native"]);
  names
});

pub fn validate_project_name(name: &str) -> bool {
  if NAME_REGEX.is_match(name) {
    !RESERVED_NAMES.contains(&name.to_lowercase().as_str())
  } else {
    false
  }
}
