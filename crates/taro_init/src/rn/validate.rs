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
  "while",
];

static NAME_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"^(?i)[$A-Z_][0-9A-Z_$]*$").unwrap());

static RESERVED_NAMES: Lazy<Vec<&str>> = Lazy::new(|| {
  let mut names = Vec::new();
  names.extend(JAVA_KEYWORDS.iter());
  names.extend(&["react", "react-native"]);
  names
});

pub fn validate_project_name(name: &str) -> bool {
  if !name.starts_with('_') && NAME_REGEX.is_match(name) {
    !RESERVED_NAMES.contains(&name.to_lowercase().as_str())
  } else {
    false
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  #[test]
  fn test_validate_project_name() {
    assert_eq!(validate_project_name("react"), false);
    assert_eq!(validate_project_name("React"), false);
    assert_eq!(validate_project_name("react-native"), false);
    assert_eq!(validate_project_name("react_native"), true);
    assert_eq!(validate_project_name("reactNative"), true);
    assert_eq!(validate_project_name("ReactNative"), true);
    assert_eq!(validate_project_name("React_Native"), true);
    assert_eq!(validate_project_name("React-Native"), false);
    assert_eq!(validate_project_name("React Native"), false);
    assert_eq!(validate_project_name("native"), false);
    assert_eq!(validate_project_name("Native"), false);
    assert_eq!(validate_project_name("strictfp"), false);
    assert_eq!(validate_project_name("Strictfp"), false);
    assert_eq!(validate_project_name("1myProject"), false);
    assert_eq!(validate_project_name("myProject1"), true);
    assert_eq!(validate_project_name("my-project"), false);
    assert_eq!(validate_project_name("PROJECT1"), true);
    assert_eq!(validate_project_name("project#"), false);
    assert_eq!(validate_project_name("project_$"), true);
    assert_eq!(validate_project_name("my-project"), false);
    assert_eq!(validate_project_name("boolean"), false);
    assert_eq!(validate_project_name("_project"), false);
    assert_eq!(validate_project_name("myProject"), true);
  }
}
