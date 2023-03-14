declare module 'react-native-exif' {
  export interface LatLong {
    latitude?: number;
    longitude?: number;
  }
  export interface UnifiedExifData {
    ImageWidth?: number;
    ImageHeight?: number;
    Orientation?: number;
    originalUri?: string;
    exif?: any;
  }
  export function getExif(uri: string): Promise<UnifiedExifData>;
  export function getLatLong(uri: String): Promise<LatLong>;
}
