import {readFile} from 'react-native-fs';
import * as Exif from 'react-native-exif';

/** Interface defining the data returned by `Exif.getExif()` */
export interface ExifData {
  imageWidth?: number;
  imageHeight?: number;
  orientation?: number;
  originalUri?: string;
  fullExif?: any;
}

/** Interface defining the datapoints we want to track for a captured image */
export interface ImageData {
  imagePath: string;
  base64: string;
  exifData?: any;
  latLong?: Exif.LatLong;
}

/** Given an image filepath on the device, extract and return all `ImageData` properties */
export const extractImageData = async (path: string): Promise<ImageData> => {
  const rawExifData = await Exif.getExif(path);
  const exifData = {
    imageWidth: rawExifData.ImageWidth,
    imageHeight: rawExifData.ImageHeight,
    orientation: rawExifData.Orientation,
    originalUri: rawExifData.originalUri,
    fullExif: rawExifData.exif,
  };

  return {
    imagePath: path,
    base64: await readFile(path, 'base64'),
    exifData: exifData,
    latLong: await Exif.getLatLong(path),
  };
};
