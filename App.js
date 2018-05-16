import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Amplify from 'aws-amplify';
import aws_exports from './src/aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';

import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import appSyncConfig from './src/AppSync.js';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { Auth } from 'aws-amplify';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import gql from 'graphql-tag';

import createMessage from './src/graphql/mutations/createMessage';


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
  render() {
    console.log('props again', this.props)
    this.props.createMessage({
        content: 'hi',
        conversationId: "convo ID",
        createdAt: '13 PM',
    })
    return (
        <View style={styles.container}>
            <Text>hiiiiyyyy. Open up App.js to start working on your app!</Text>
            <Text>Changes you make will automatically reload.</Text>
            <Text>Shake your phone to open the developer menu.</Text>
        </View>
    );
  }
}

const AppGraphQL = compose(
    graphql(createMessage, {
        props: (props) => ({
            createMessage: (message) => {
                console.log('mutating')
                props.mutate({
                    variables: {
                        content: message.content,
                        createdAt: message.createdAt,
                        conversationId: message.conversationId,
                    }
                }).then( data => console.log('data', data))
            }
        })
    }),
)(App);

class WithProvider extends React.Component {
  render() {

    console.log('props', this.props)

    return (
        <ApolloProvider client={client}>
            <Rehydrated>
                <AppGraphQL/>
            </Rehydrated>
        </ApolloProvider>
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

export default withAuthenticator(WithProvider);
