import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {styles} from './styles';
import colors from '@theme/colors';
import {AppButtonProps} from 'types';

const AppButton: React.FC<AppButtonProps> = ({
  isLoading,
  disabled,
  text,
  color = colors.primary,
  ...props
}) => {
  const backgroundColor = color;

  return (
    <TouchableOpacity
      {...props}
      disabled={Boolean(isLoading || disabled)}
      style={[styles.container, props.style, {backgroundColor}]}>
      {isLoading ? (
        <ActivityIndicator color={colors.languageBadgeBackground} />
      ) : (
        <Text style={styles.btnText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default memo(AppButton);
