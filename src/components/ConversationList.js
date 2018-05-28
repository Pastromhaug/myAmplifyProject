import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import { Auth } from 'aws-amplify';

import createUser from '../graphql/mutations/createUser';
import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import createUserConversations from '../graphql/mutations/createUserConversations';
// import createConversation from '../graphql/mutations/createConversation';
import getMe from '../graphql/queries/getMe';


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

    _createUserConversation() {
        this.props.createUserConversations(this.props.cognitoId, 'convo ID', )
    }

    render() {
        console.log('ConversationList render props: ', this.props);
        return (
            <View>
                <FlatList
                    data={this.props.conversationConnection}
                    renderItem={({item}) => <Text>{item.conversation.name}</Text>} />
                <Button
                    onPress={() => this._createUserConversation()}
                    title='Create Conversation'/>
            </View>
        )
    }
}

const ConversationListGraphQL = compose(
    graphql(getMe, {
        options: { fetchPolicy: 'cache-and-network' },
        props: (props) => {
            return {
                cognitoId: props.data.me.cognitoId,
            }
        }
    }),
    graphql(getUserConversationsConnection, {
        options: { fetchPolicy: 'cache-and-network' },
        props: (props) => {
            return {
                conversationConnection: props.data.me.conversations.userConversations,
            }
        }
    }),
    graphql(createUserConversations, {
        props: (props) => ({
            createUserConversations: (user_id, conversation_id) => {
                console.log('createUserConversation params: ', user_id, conversation_id);
                props.mutate({
                    variables: {
                        userId: user_id,
                        conversationId: conversation_id,
                    }
                }).then( data => console.log('createUserConversations data: ', data))
            }
        })
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
