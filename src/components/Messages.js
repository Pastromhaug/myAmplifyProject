import React from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import { Auth } from 'aws-amplify';

import createUser from '../graphql/mutations/createUser';
import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';


class ConversationList extends React.Component {

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

    _renderItem(item) {
        return (
            <TouchableOpacity>
                <Text>{item.item.conversation.name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View>
                <Text> Messages </Text>
                <FlatList
                    data={this.props.conversationConnection}
                    renderItem={this._renderItem} />
                <Button
                    onPress={() => this.props.navigation.navigate('CreateConversation')}
                    title='Create Conversation'/>
            </View>
        )
    }
}

const ConversationListGraphQL = compose(
    graphql(getUserConversationsConnection, {
        options: { fetchPolicy: 'cache-and-network' },
        props: (props) => {
            return {
                conversationConnection: props.data.me.conversations.userConversations,
            }
        }
    }),
    graphql(createUser, {
        props: (props) => ({
            createUser: (user) => {
                props.mutate({
                    variables: {
                        username: user.username,
                        id: user.id,
                        cognitoId: user.cognitoId,
                        registered: false
                    }
                }).then( data => {})
            }
        })
    }),
)(ConversationList)

export default ConversationListGraphQL;

