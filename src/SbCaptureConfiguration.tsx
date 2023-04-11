import {
  SbAndroidCaptureFlashMode,
  SbCaptureConfiguration,
} from '@sensibill/reactnative-bridge-sdk';

export const captureConfiguration: SbCaptureConfiguration = {
  captureFeatures: {
    androidFlags: {
      defaultFlashMode: SbAndroidCaptureFlashMode.FLASH_MODE_OFF,
    },
    iosFlags: {
      enableTorch: false,
    },
    enableAutoCapture: false,
    maxImages: 4,
    enableLongCapture: false,
    attachLocationData: true,
  },
  branding: {
    iosColors: {
      primary: 0x8b3b60,
      onPrimary: 0xffffff,
      secondary: 0x3b8b66,
      onSecondary: 0xffffff,
      focus: 0xbd648d,
      captureBackground: 0x201000,
    },
    iosBundles: {
      localization: {
        kind: 'custom',
        name: 'SensibillStrings.bundle',
      },
      images: {
        kind: 'main',
      },
    },
    iosFonts: {
      largeTitle: {
        name: 'Genos-Bold',
        size: 32,
      },
      subheadline: {
        name: 'Genos-ExtraBold',
        size: 20,
      },
      body: {
        name: 'Genos-Regular',
        size: 24
      }
    },
  },
};
