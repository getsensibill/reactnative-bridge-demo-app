import { readFile } from 'react-native-fs';
import * as Exif from '@lodev09/react-native-exify';

export interface ExifData {
  imageWidth?: number;
  imageHeight?: number;
  orientation?: number;
  make?: string;
  model?: string;
}

export interface LatLong {
  latitude?: number;
  longitude?: number;
}

export interface ImageData {
  imagePath: string;
  base64: string;
  exifData?: any;
  latLong?: LatLong;
  sdkMetadata?: string;
}

export const extractImageData = async (path: string): Promise<ImageData> => {
  const base64 = await readFile(path, 'base64');

  const rawExifData = await Exif.readAsync(`file://${path}`);
  if (rawExifData === undefined) {
    return {
      imagePath: path,
      base64: base64,
    };
  }

  const exifData = {
    imageWidth: rawExifData.ImageWidth,
    imageHeight: rawExifData.ImageLength,
    orientation: rawExifData.Orientation,
    make: rawExifData.Make,
    model: rawExifData.Model,
  };

  const latLong = {
    latitude: rawExifData.GPSLatitude,
    longitude: rawExifData.GPSLongitude,
  };

  return {
    imagePath: path,
    base64: base64,
    exifData: exifData,
    latLong: latLong,
    // SDK may publish additional metadata in UserComment
    sdkMetadata: rawExifData.UserComment,
  };
};