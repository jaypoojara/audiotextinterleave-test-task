import React, {memo} from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {styles} from './styles';
import {FullScreenContainerProps} from 'types';

export const FullScreenContainer: React.FC<FullScreenContainerProps> = ({
  children,
  style,
  edges = ['top'],
}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={edges} style={[styles.container, style]}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default memo(FullScreenContainer);
