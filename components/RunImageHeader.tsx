import { Image, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function RunImageHeader() {
  return (
    <Image
      source={require('assets/run.png')}
      style={{ width: screenWidth, height: screenWidth * 0.75 }}
      resizeMode="cover"
    />
  );
}
