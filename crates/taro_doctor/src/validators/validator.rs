
#[derive(Debug, PartialEq, Eq)]
pub enum ValidationType {
  Crash,
  Missing,
  Partial,
  NotAvailable,
  Success,
}

#[derive(Debug, PartialEq, Eq)]
pub enum ValidationMessageType {
  Error,
  Hint,
  Information,
}

/// => ValidationMessage
/// 检验信息
pub struct ValidationMessage {
  r#type: ValidationMessageType,
  message: String,
}

impl ValidationMessage {
  pub fn new (message: &str, r#type: ValidationMessageType) -> ValidationMessage {
    ValidationMessage {
      message: message.to_string(),
      r#type,
    }
  }

  pub fn info (message: &str) -> ValidationMessage {
    ValidationMessage::new(message, ValidationMessageType::Information)
  }

  pub fn error (message: &str) -> ValidationMessage {
    ValidationMessage::new(message, ValidationMessageType::Error)
  }

  pub fn hint (message: &str) -> ValidationMessage {
    ValidationMessage::new(message, ValidationMessageType::Hint)
  }

  pub fn is_info (&self) -> bool {
    self.r#type == ValidationMessageType::Information
  }

  pub fn is_error (&self) -> bool {
    self.r#type == ValidationMessageType::Error
  }

  pub fn is_hint (&self) -> bool {
    self.r#type == ValidationMessageType::Hint
  }
}

/// => ValidationIndicator
/// 检验样式
pub struct ValidatorIndicator {

}

impl ValidatorIndicator {
  pub fn get_indicator (r#type: ValidationMessageType) -> &'static str {
    match r#type {
      ValidationMessageType::Error => "✗",
      ValidationMessageType::Hint => "!",
      ValidationMessageType::Information => "•"
    }
  }

  pub fn colored_indicator (r#type: ValidationMessageType) -> &'static str {
    match r#type {
      ValidationMessageType::Error => "red",
      ValidationMessageType::Hint => "yellow",
      ValidationMessageType::Information => "green"
    }
  }
}

/// => ValidationResult
/// 检验结果
pub struct ValidationResult {
  status: ValidationType,
  messages: Vec<ValidationMessage>
}

