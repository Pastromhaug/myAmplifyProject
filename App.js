import React from 'react';
import { View, Text } from 'react-native';

import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import { createStackNavigator } from 'react-navigation';

import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import appSyncConfig from './src/AppSync.js';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { ApolloProvider } from 'react-apollo';

import ConversationList from './src/components/ConversationList';
import CreateConversation from './src/components/CreateConversation';
import Messages from './src/components/Messages';

import createUser from './src/graphql/mutations/createUser';


Amplify.configure(aws_exports)

console.disableYellowBox = true;

const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
  },
});

Auth.currentSession().then( ({ idToken: { payload } }) => {
  client.mutate({
    mutation: createUser,
    variables: {
      username: payload['cognito:username'],
      id: payload['sub'],
      cognitoId: payload['sub'],
    }
  });
}).catch(err => {
  console.log('currentSession error: ', err);
})

const AppNavigation = createStackNavigator(
  { Conversations: ConversationList,
    CreateConversation: CreateConversation,
    Messages: Messages },
  { initialRouteName: 'Conversations'}
);

class withProvidor extends React.Component {
  render() {
    return (
      <ApolloProvider client={ client }>
        <Rehydrated>
          <AppNavigation />
        </Rehydrated>
      </ApolloProvider>
    );
  }
}

export default withAuthenticator(withProvidor)
