import { Image, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function RunImageHeader() {
  const [imageHeight, setImageHeight] = useState(200); // default fallback

  useEffect(() => {
    Image.getSize(
      require('assets/run.png'),
      (width, height) => {
        const ratio = height / width;
        setImageHeight(screenWidth * ratio);
      },
      (error) => {
        console.error('Failed to get image size:', error);
      }
    );
  }, []);

  return (
    <Image
      source={require('assets/run.png')}
      style={{ width: screenWidth, height: imageHeight }}
      resizeMode="cover"
    />
  );
}
