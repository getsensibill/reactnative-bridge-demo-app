# reactnative-bridge-demo-app

## Setup

### Required Android Setup - Add Maven Credentials

In order to resolve the Android Sensibill SDK dependency, you must enter valid credentials for the Sensibill Maven server.

- Open the `/android/build.gradle` file
- Find the block that imports the Sensibill Maven server (inside `allprojects.repositories`)
- In the `credentials` block, insert the Maven username and password provided to you by Sensibill support

### Required iOS Setup
Please ensure you have access to the Sensibill iOS SDK.  Sensibill support will provide you with your preferred method of accessing the iOS SDK.


### Yarn

Currently we're using `yarn` instead of `npm`.

**Setup**
*Install Yarn*
https://classic.yarnpkg.com/lang/en/docs/install/

Depending on whether you've already used the project with npm, or if you're setting up a fresh checkout the setup instructions will differ:
*Fresh Checkout*
- Run `yarn`

*Switching To Yarn*
https://ncoughlin.com/posts/switching-yarn-npm/
- Delete any `*.lock` files in the root dir
- Delete the `node_modules` folder
- Run `yarn`

## Running the Demo
Once setup is complete, you can run the demo on your device(s) to observe and test by using the commands `yarn ios` or `yarn android`.


## Exploring the Demo Code

First, to more easily understand the demo code it will always be a good idea to have our [Usage Documentation](https://sensibill.github.io/spend-manager-docs/reactnative-bridge/) nearby.

### Places to Look
#### React Native Source
- `/src/App.tsx` contains our main (only) component.  This can be a good reference for observing the usage of our Capture flow entry point.
- `/src/SbCaptureConfiguration.tsx` contains a sample instance creation of the capture configuration object.
- `/src/PermissionHandling.tsx` contains code that requests the user for location permissions when required
- `/src/ImageHandling.tsx` contains an example of how to handle/parse the images returned by the capture flow

#### Android Source
- `/android/app/src/main/res/values/sb__styles.xml` contains a sample overridden theme

#### iOS Source
Nothing notable at current time
