use super::DoctorValidator;
use super::super::CocoaPod;


pub struct CocoaPodValidator {
  cocoapod: CocoaPod
}

impl CocoaPodValidator {
  fn new () {
    CocoaPodValidator {
      cocoapod: CocoaPod::new()
    }
  }
}


impl DoctorValidator for CocoaPodValidator {
  async fn validate (&self) -> Result<ValidationResult> {
    let mut messages: Vec<ValidationMessage> = [];
    let cocoaPodsStatus = self.evaluate().await;
    let status = ValidationType::Success;

    match cocoaPodsStatus {
      CocoaPodsStatus::Recommended => {
        messages.push(ValidationMessage::new(""))
      },

      CocoaPodsStatus::NotInstalled => {
        messages.push(ValidationMessage::new(""));
        status = ValidationType::Missing;
      },

      CocoaPodsStatus::BrokenInstall => {
        status = ValidationType::Missing;
        messages.push(ValidationMessage::new(""));
      }

      CocoaPodsStatus::UnknownVersion => {
        status = ValidationType::Partial;
        messages.push(ValidationMessage::new(""));
      }
     
      CocoaPodsStatus::BelowRecommendedVersion => {
        status = ValidationType::Partial;
        messages.push(ValidationMessage::new(""));
      }

      CocoaPodsStatus::BelowMinimumVersion => {
        status = ValidationType::Partial;
        messages.push(ValidationMessage::new(""));
      }
    }

    ValidationResult::new(status, messages)
  }
}