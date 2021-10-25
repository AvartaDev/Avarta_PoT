require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "rnsolus"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/Pranipaso/faceTec.git", :tag => "#{s.version}" }
  s.vendored_frameworks = "ios/InMobileMME.framework","ios/Frameworks/_25519.framework","ios/Frameworks/FaceTecSDK.framework","ios/Frameworks/Solus_DLock_SDK.framework","ios/SolusIntegrationLibrary.framework"
  s.source_files = "ios/**/*.{h,m,mm}","ios/BehavioSecIOSSDK.a"
  s.dependency "React-Core"
end
