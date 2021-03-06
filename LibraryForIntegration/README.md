## Clone Project

Clone the project from the given solus library link by using:

> git clone https://darshana_solusps@bitbucket.org/darshana_solusps/reactnative_banking_app_de.git

>###### Please pull the branch solus_library by using the following command in the terminal of the cloned project
>>`git pull origin solus_library`

Open the Cloned Project and run command `npm install` in the terminal

## Installation

In your project first run the command:

> npm install --save "filepath"

> > Here filepath is the location path of Project cloned

Then run your project in your real devices and not simulators:

> if there is an error :

##### Unable to resolve library module and library name could not be found

###### Solution

1). Copy all the files of the project cloned

2). Create a folder named rnsolus in the node_modules of your project paste the files you copied and reload the project

## IOS Installation

> you will get an error if you run the project in simulator so make sure you run it in the real device.

If an error occurs while executing `npm install --save "filepath"` like "sh command failed or something related bob

> Here filepath is the location path of Project cloned

---

> first open the cloned project and delete node_modules folder if any and type npm install in the terminal then again try to install using the same command i.e. `npm install --save "filepath".`

After installing the library

> Go the terminal of your project and type `cd ios` and the type `pod install `open xcode and select build phases ( you can find it when you click the name of your project name in the side menu you will see a navigation bar at the top and there you can find the build phases) in the build phases open Link Binary with libraries,
> click the add icon which you can see the `+` icon below the list you will see a popup where you can find dropdown at the bottom of the popup box click on it and select Add files and find the node_modules of your project and select `rnsolus` folder inside it and then go to ios folder where you can find `behaviosecSDK.a` file ,
> click on it to add it in the linked binaries , after make sure you can see the added file in the list.

now run your project

## ANDROID Installation

add these files in the `AndroidManifest.xml` of your project

> `xmlns:tools="http://schemas.android.com/tools"` inside the `Manifest` tag at the top
> `tools:replace="android:allowBackup` inside the `Application` tag at the top

Add these after the `Activity` tag inside the application

    	<service
            android:name="com.reactnativesolus.InauthService"
            android:permission="android.permission.BIND_JOB_SERVICE"/>
        <uses-library
            android:name="org.apache.http.legacy"
            android:required="false" />

Inside the `android` tag inside the `build.gradle` file situated inside the app folder of android

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

then run the whole project again

**if an Error occurs like**

> ###### Error Failed to install the app. Make sure you have the Android development environment set up: https://reactnative.dev/docs/environment-setup.
>
> ###### Error: Command failed: gradlew.bat app:installDebug -PreactNativeDevServerPort=8081Error: Command failed: gradlew.bat app:installDebug -PreactNativeDevServerPort=8081

> ##### FAILURE: Build failed with an exception.

- What went wrong:
  Execution failed for task app:checkDebugAarMetadata'.
  > A failure occurred while executing com.android.build.gradle.internal.tasks.CheckAarMetadataWorkAction
  > The `minCompileSdk (31) `specified in a dependency's AAR metadata (META INF/com/android/build/gradle/aar-metadata.properties) is greater than this module's `compileSdkVersion (android-30)`.

then change the` compile sdk version` to **31** as mentioned in the error, it should be greater than the **mincompilesdk** version which is currently 31.

after changing it again

> re-run the whole project

in the `App.Js` file of your project

### First Import the library

    import Solus from 'rnsolus'

##### declare constants

     const SERVER_BASE_URL = "https://platform.solusconnect.com/"

     const ORGANISATION_KEY = "A5014D70-7956-478E-9680-C9B6CEA67689"

     const DeviceKeyIdentifier = "dr33yhXwWE7gnyZaBxraLtZppdaArzFG"

     const FaceScanEncryptionKey = "-----BEGIN PUBLIC KEY-----\n" +"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n" +"M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n" +"DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n" +"mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n" +"GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n" +"ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n" +"8QIDAQAB\n" +"-----END PUBLIC KEY-----"

now run the following command

#### To Start the Procedures

    Solus.onCreate(DeviceKeyIdentifier,FaceScanEncryptionKey,SERVER_BASE_URL,ORGANISATION_KEY)

#### For Enrolling the User

    Solus.EnrollProcess(UserName,Password)

#### For Autheticate the User

     Solus.AuthenticationProcess(UserName,Password)

#### For DeEnrolling the User

     Solus.DeEnrollProcess(UserName,Password)

###### You can find the sample file of `App.js` in the example folder of the project cloned

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
