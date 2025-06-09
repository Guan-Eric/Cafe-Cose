import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';

const CardLoader = ({ width, height }: { width: number; height: number }) => {
  return (
    <View>
      <ContentLoader
        speed={2}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        backgroundColor="#FFFFFF"
        foregroundColor="#F0F0F0">
        <Rect x="0" y="0" rx="14" ry="14" width={width} height={height} />
      </ContentLoader>
    </View>
  );
};

export default CardLoader;
