import React from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import { Auth } from 'aws-amplify';

import createUser from '../graphql/mutations/createUser';
import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import getMe from '../graphql/queries/getMe';


class   ConversationList extends React.Component {

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
        console.log('conversationList render props: ', this.props)
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
                }).then( data => {
                    console.log('createUser data: ', data);
                })
            }
        })
    }),
    graphql(getMe, {
        props: (props) => {
            if (props.data.me !== undefined) {
                console.log('getMe props: ', props)
                return {
                    cognitoId: props.data.me.cognitoId,
                }
            } else {
                console.log('getMe props no me: ', props)
            }
        }
    }),
    graphql(getUserConversationsConnection, {
        props: (props) => {
            console.log('getUserConversationsConnection props: ', props)
            return {
                conversationConnection: props.data.me.conversations.userConversations,
            }
        }
    }),
)(ConversationList)

export default ConversationListGraphQL;
