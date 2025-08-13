import { Image, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface MenuCardImageProps {
  url: string;
}

export default function MenuCardImage({ url }: MenuCardImageProps) {
  return (
    <Image
      source={{ uri: url }}
      style={{ width: screenWidth * 0.42, height: screenWidth * 0.35 }}
      className="rounded-t-xl"
      resizeMode="cover"
    />
  );
}
