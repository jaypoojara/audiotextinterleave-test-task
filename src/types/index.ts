import {StyleProp, TouchableOpacityProps, ViewStyle} from 'react-native';
import {Edges} from 'react-native-safe-area-context';

export type Transcript = {
  pause: number;
  speakers: Speaker[];
};

export type Speaker = {
  name: string;
  phrases: Phrase[];
};

export type Phrase = {
  words: string;
  time: number;
};

export type TranscriptResult = {
  name: string;
  words: string;
  time: number;
  startTime: number;
  endTime: number;
};

export type AppButtonProps = TouchableOpacityProps & {
  isLoading?: boolean;
  text: string;
  color?: string;
};

export type FullScreenContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edges;
};

export type ErrorBoundaryWrapperProps = {
  children: JSX.Element;
};
