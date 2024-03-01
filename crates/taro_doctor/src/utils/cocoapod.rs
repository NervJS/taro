pub enum CocoapodStatus {
   // iOS plugins will not work, installation required.
   NotInstalled,

   // iOS plugins might not work, upgrade recommended.
   UnknownVersion,
   
   // iOS plugins will not work, upgrade required.
   BelowMinimumVersion,
   
   // iOS plugins may not work in certain situations (Swift, static libraries),
   // upgrade recommended.
   BelowRecommendedVersion,
   
   // Everything should be fine.
   Recommended,
   
   // iOS plugins will not work, re-install required.
   BrokenInstall,
}



pub struct Cocoapod {
  status: CocoapodStatus
}


impl Cocoapod {

}

impl ProcessUtils for Cocoapod {
  fn is_installed () -> bool {
    Process::exits_happy()
  }
}

