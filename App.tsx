import ErrorBoundaryWrapper from '@components/ErrorBoundaryWrapper';
import AppNavigator from '@navigation/AppNavigator';
import React from 'react';

const App = () => {
  return (
    <ErrorBoundaryWrapper>
      <AppNavigator />
    </ErrorBoundaryWrapper>
  );
};

export default App;
