import React, {memo, useCallback} from 'react';
import ErrorBoundary, {
  FallbackComponentProps,
} from 'react-native-error-boundary';
import {styles} from './styles';
import {ErrorBoundaryWrapperProps} from 'types';
import {Text} from 'react-native';
import AppButton from '@components/AppButton';
import FullScreenContainer from '@components/FullScreenContainer';

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
  children,
}) => {
  const FallbackComponent = useCallback(
    ({error, resetError}: FallbackComponentProps) => {
      return (
        <FullScreenContainer style={styles.container}>
          <Text style={styles.textStyle}>Oops!</Text>
          <Text style={styles.errorText}>Error: {error.message}</Text>
          <AppButton text="Try Again" onPress={resetError} />
        </FullScreenContainer>
      );
    },
    [],
  );

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

export default memo(ErrorBoundaryWrapper);
