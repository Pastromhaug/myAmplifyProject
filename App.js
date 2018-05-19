import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';

import Amplify from 'aws-amplify';
import aws_exports from './src/aws-exports';
import { Authenticator } from 'aws-amplify-react-native';

import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import appSyncConfig from './src/AppSync.js';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { Auth } from 'aws-amplify';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import gql from 'graphql-tag';

import createMessage from './src/graphql/mutations/createMessage';
import createUser from './src/graphql/mutations/createUser';
import getMe from './src/graphql/queries/getMe';


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
          this.logInfoToConsole(session);
          this.state =  {session};
          this.register();
          this.createUser();
        });
    }

    register() {
        client.watchQuery({
            query: getMe,
            fetchPolicy: 'cache-only'
        }).subscribe(({data}) => {
            if (data) {
                console.log('me data', data)
            }
        });
    }

    logInfoToConsole(session) {
        console.log(session);
        console.log(`ID Token: <${session.idToken.jwtToken}>`);
        console.log(`Access Token: <${session.accessToken.jwtToken}>`);
        console.log('Decoded ID Token:');
        console.log(JSON.stringify(session.idToken.payload, null, 2));
        console.log('Decoded Acess Token:');
        console.log(JSON.stringify(session.accessToken.payload, null, 2));
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
                <View style={styles.container}>
                    <Text>hiiiiyyyy. Open up App.js to start working on your app!</Text>
                    <Text>Changes you make will automatically reload.</Text>
                    <Text>Shake your phone to open the developer menu.</Text>
                </View>
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
                }).then( data => console.log('createMessage data:', data))
            }
        })
    }),
    graphql(createUser, {
        createUser: (user) => {
            console.log('createUse session', this.state.session);
            props.mutate({
                variables: {
                    username: this.state.session.idToken.payload['cognito:username'],
                    id: this.state.session.idToken.payload['sub'],
                    cognitoId: this.state.session.idToken.payload['sub'],
                    registered: false
                }
            })
        }
    })
)(App);

class withAuthentication extends React.Component {
  render() {
    return (
        <Authenticator>
            <ApolloProvider client={client}>
                <Rehydrated>
                    <AppGraphQL/>
                </Rehydrated>
            </ApolloProvider>
        </Authenticator>
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

export default withAuthentication
