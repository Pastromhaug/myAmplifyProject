import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Amplify from 'aws-amplify';
import aws_exports from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';

Amplify.configure(aws_exports)

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>hiiiiyyyy. Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withAuthenticator(App);
