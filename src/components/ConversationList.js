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

    _navigateToMessages(conversationId) {
        return () => {
            console.log('navigating to ', conversationId)
            this.props.navigation.navigate('Messages', { conversationId })
        }
    }

    _renderItem(item) {
        conversationId = item.item.conversation.id;
        conversationName = item.item.conversation.name;
        return (
            <TouchableOpacity onPress={ this._navigateToMessages(conversationId) }>
                <Text>{conversationName}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.props.conversationConnection}
                    renderItem={this._renderItem.bind(this)} />
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
