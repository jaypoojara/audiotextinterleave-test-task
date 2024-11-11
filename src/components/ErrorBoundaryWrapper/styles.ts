import {StyleSheet} from 'react-native';
import colors from '@theme/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: '500',
  },
  errorText: {
    color: colors.error,
  },
});
