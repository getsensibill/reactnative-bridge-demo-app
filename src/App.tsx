import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {requestLocationPermissions} from './PermissionHandling';
import {extractImageData, ImageData} from './ImageHandling';
import {SbCaptureError, SensibillCaptureStandalone} from '@sensibill/reactnative-bridge-sdk';
import {captureConfiguration} from './SbCaptureConfiguration';
import {unlink} from 'react-native-fs';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[styles.sectionContainer, styles.centeredContainer]}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const [imagesData, setImagesData] = React.useState<
    (ImageData | undefined)[] | undefined
  >();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    requestLocationPermissions();
  });

  const heightSpacerStyle = (height: number = 50) => {
    return {
      height: height,
      width: 50,
    };
  };

  const captureDocuments = async () => {
    try {
      const capturedDocuments =
        await SensibillCaptureStandalone.captureDocuments(captureConfiguration);
      onDocumentsCaptured(capturedDocuments);
    } catch (e) {
      console.log(JSON.stringify(e, undefined, 2));

      // The error can be parsed to determine the exact error code and message
      const wrapped = e as SbCaptureError;
      console.log(`Capture error code: ${wrapped.code}`);
      console.log(`Capture error message: ${wrapped.message}`);
    }
  };

  const onDocumentsCaptured = async (capturedImageFiles: string[]) => {
    if (capturedImageFiles && capturedImageFiles.length > 0) {
      console.log(`Received ${capturedImageFiles.length} images`);

      const data: (ImageData | undefined)[] = await Promise.all(
        capturedImageFiles.map(async file => {
          try {
            return await extractImageData(file);
          } catch (e) {
            console.log(`Failed to extract data from image file: ${e}`);
            return undefined;
          }
        }),
      );

      console.log('Captured images opened.');
      setImagesData(data);
    }
  };

  const deleteCurrentImages = async () => {
    const imageFiles: string[] | undefined = imagesData
      ?.map(data => data?.imagePath)
      ?.filter(path => path !== undefined) as string[] | undefined;

    if (imageFiles) {
      await Promise.all(
        imageFiles.map(async file => {
          try {
            await unlink(file);
            return true;
          } catch (e) {
            console.log(`failed to delete image(${file}): ${e}`);
            return false;
          }
        }),
      );

      setImagesData(undefined);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.pageTitle}>
            Sensibill React Native Bridge Demo App
          </Text>

          <Section title="Launch Capture">
            <View style={[styles.centeredContainer, styles.row]}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Launch Capture"
                  onPress={() => captureDocuments()}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Delete Current Images"
                  onPress={() => deleteCurrentImages()}
                  disabled={imagesData === undefined}
                />
              </View>
            </View>
          </Section>

          <View style={heightSpacerStyle(28)} />

          <Section title="Capture Results">
            {imagesData?.map(data => {
              if (data === undefined) {
                return <Text>Failed to load image</Text>;
              }

              const { base64: image, exifData, latLong, sdkMetadata } = data;
              const { imageWidth, imageHeight } = data.exifData;

              const targetWidth = 150;
              const defaultHeight = 250;

              const actualWidth = imageWidth ?? targetWidth;
              const actualHeight = imageHeight ?? defaultHeight;
              const factor = targetWidth / actualWidth;

              const width = actualWidth * factor;
              const height = actualHeight * factor;
              

              const imageViewSize = (() => {
                return {
                  height: height,
                  width: width,
                };
              })();

              return (
                <View key={data.imagePath}>
                  <View
                    key={data.imagePath}
                    style={[styles.centeredContainer, styles.row]}>
                    <Image
                      source={{uri: `data:image/jpeg;base64,${image}`}}
                      style={[styles.imageStyle, imageViewSize]}
                    />
                    <View>
                      <Text style={styles.bold}>Exif Data:</Text>
                      <Text>Width: {`${imageWidth}`}</Text>
                      <Text>Height: {`${imageHeight}`}</Text>
                      <Text>Make: {`${exifData?.make}`}</Text>
                      <Text>Model: {`${exifData?.model}`}</Text>
                      <Text style={styles.bold}>GPS Data:</Text>
                      <Text>Lat: {`${latLong?.latitude}`}</Text>
                      <Text>Long: {`${latLong?.longitude}`}</Text>
                      <Text style={styles.bold}>SDK Metadata:</Text>
                      <Text>{`${sdkMetadata}`}</Text>
                    </View>
                  </View>
                  <View style={heightSpacerStyle(12)} />
                </View>
              );
            })}
          </Section>

          <View style={heightSpacerStyle(28)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    margin: 12,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    borderWidth: 1,
    borderColor: 'red',
    resizeMode: 'contain',
    backgroundColor: 'white',
    marginEnd: 8,
  },
  row: {
    flexDirection: 'row',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default App;
