import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Text, View } from 'native-base';

interface LoadingIndicatorState {
  isLoading: boolean;
}

class LoadingIndicator extends React.Component<{}, LoadingIndicatorState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 5000);
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text fontSize={22} fontFamily={'Tilt'} color={'black.normal'}>Carregando Mensagens</Text>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }

    return null;
  }
}

export default LoadingIndicator;
