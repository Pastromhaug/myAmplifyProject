import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';

import Amplify from 'aws-amplify';
import aws_exports from './src/aws-exports';
import { Authenticator } from 'aws-amplify-react-native';
import { createStackNavigator } from 'react-navigation';

import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import appSyncConfig from './src/AppSync.js';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { Auth } from 'aws-amplify';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import createMessage from './src/graphql/mutations/createMessage';
import createUser from './src/graphql/mutations/createUser';

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


class App extends React.Component {

    constructor(props) {
        super(props);
        Auth.currentSession().then(session => {
            props.createUser({
                username: session.idToken.payload['cognito:username'],
                id: session.idToken.payload['sub'],
                cognitoId: session.idToken.payload['sub'],
            });
        });
    }

    _sendMessage() {
        this.props.createMessage({
            content: 'hi2',
            conversationId: "convo ID2",
            createdAt: '13 PM',
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={this._sendMessage.bind(this)}>
                <ConversationList/>
            </TouchableOpacity>
        );
    }
}

const AppGraphQL = compose(
    graphql(createMessage, {
        props: (props) => ({
            createMessage: (message) => {
                props.mutate({
                    variables: {
                        id: 'id1',
                        content: message.content,
                        createdAt: message.createdAt,
                        conversationId: message.conversationId,
                    }
                }).then( data => {})//'console.log('createMessage data:', data)')
            }
        })
    }),
    graphql(createUser, {
        props: (props) => ({
            createUser: (user) => {
                // console.log('createUse session', user);
                props.mutate({
                    variables: {
                        username: user.username,
                        id: user.id,
                        cognitoId: user.cognitoId,
                        registered: false
                    }
                }).then( data => {})//console.log('createUser data: ', data))
            }
        })
    }),
)(App);


const AppNavigation = createStackNavigator(
    {
        Conversations: AppGraphQL,
    }
    {
        initialRouteName: 'Conversations',
    }
});

class withAuthentication extends React.Component {
  render() {
    return (
        <Authenticator>
            <ApolloProvider client={client}>
                <Rehydrated>
                    <AppNavigation/>
                </Rehydrated>
            </ApolloProvider>
        </Authenticator>
    );
  }
}

export default withAuthentication
