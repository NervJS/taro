
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
  fn validate () {
    
  }
}