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
      onSurfaceFocus: 0xbd648d,
    },
  },
};
