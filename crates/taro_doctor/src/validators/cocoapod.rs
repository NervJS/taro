
pub struct CocoapodValidator {
  cocoapod: Cocoapod
}

impl CocoapodValidator {
  fn new () {
    CocoapodValidator {
      cocoapod: Cocoapod::new()
    }
  }
}

impl DoctorValidator for CocoapodValidator {
  fn validate () {
    
  }
}