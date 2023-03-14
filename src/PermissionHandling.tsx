import Geolocation, {
  GeolocationError,
} from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform} from 'react-native';

/**
 * If required, request permission from the user to access the device location.
 */
export const requestLocationPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const alreadyGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION!,
      );
      if (alreadyGranted) {
        return;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION!,
      );
      console.log(`${granted}`);
    } catch (e) {
      console.log('permission request error', e);
    }
    return;
  }

  if (Platform.OS === 'ios') {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });

    const [granted, err] = await new Promise<[boolean, GeolocationError?]>(
      (resolve, reject) => {
        Geolocation.requestAuthorization(
          () => {
            resolve([true, undefined]);
          },
          error => {
            reject([false, error]);
          },
        );
      },
    );

    console.log(`Permissions granted: ${granted}`);
    if (err !== undefined) {
      console.log(`Permission request error: ${err}`);
    }
  }
};
