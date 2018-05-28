import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';

import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import { createStackNavigator } from 'react-navigation';

import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import appSyncConfig from './src/AppSync.js';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import createMessage from './src/graphql/mutations/createMessage';

import ConversationList from './src/components/ConversationList';


Amplify.configure(aws_exports)

console.disableYellowBox = true;

const client = new AWSAppSyncClient({
    url: appSyncConfig.graphqlEndpoint,
    region: appSyncConfig.region,
    auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
    }
});

const AppNavigation = createStackNavigator(
    { Conversations: ConversationList },
    { initialRouteName: 'Conversations'}
);

class withProvidor extends React.Component {
  render() {
    return (
        <ApolloProvider client={client}>
            <Rehydrated>
                {/*<Text> hii 2 </Text>*/}
                <AppNavigation/>
            </Rehydrated>
        </ApolloProvider>
    );
  }
}

export default withAuthenticator(withProvidor)
