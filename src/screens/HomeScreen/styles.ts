import {StyleSheet} from 'react-native';
import colors from '@theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  headerContainer: {
    zIndex: 1,
    backgroundColor: colors.headerBackground,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    paddingTop: 14,
  },
  flagContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
    padding: 3,
    borderRadius: 100,
    gap: 26,
    backgroundColor: colors.flagContainerBackground,
  },
  flagImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  flatListContainer: {
    flexGrow: 1,
    padding: 26,
    gap: 24,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    backgroundColor: colors.whiteOpacity80,
  },
  activeCardContainer: {
    borderColor: colors.borderLight,
    backgroundColor: colors.activeCardBackground,
  },
  cardRow: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  languageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.languageBadgeBorder,
    borderRadius: 100,
    backgroundColor: colors.languageBadgeBackground,
  },
  languageText: {
    fontWeight: '900',
    fontSize: 12,
    color: colors.languageText,
  },
  primaryText: {
    flex: 1,
    fontWeight: '600',
    fontSize: 17,
    color: colors.primaryText,
  },
  activePrimaryText: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  activeDivider: {
    backgroundColor: colors.borderLight,
  },
  secondaryText: {
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
    color: colors.secondaryText,
  },
  activeSecondaryText: {
    color: colors.activeSecondaryText,
  },
  footerContainer: {
    backgroundColor: colors.headerBackground,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.progressBarBackground,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    width: '90%',
    backgroundColor: colors.primary,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  timerText: {
    fontWeight: '500',
    fontSize: 10,
    color: colors.timerText,
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  controlIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  playButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.progressBarBackground,
  },
  playIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  linearGradient: {height: 75, width: '100%'},
  gradientTop: {position: 'absolute', top: 0, width: '100%'},
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    transform: [{scaleY: -1}],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
});
