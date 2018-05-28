import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import { Auth } from 'aws-amplify';

import createUser from '../graphql/mutations/createUser';
import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import createUserConversations from '../graphql/mutations/createUserConversations';
import createConversation from '../graphql/mutations/createConversation';
import getMe from '../graphql/queries/getMe';


class CreateConversation extends React.Component {

    _createUserConversation() {
        console.log('createing user convo')
        let userConvo = this.props.createUserConversations(this.props.cognitoId, 'convo ID', )
        console.log('userConvo', userConvo)
    }

    render() {
        console.log('CreateConversation render props: ', this.props);
        return (
            <View>
                <Text> Create Conversation </Text>
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

const CreateConversationGraphQL = compose(
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
                props.mutate({
                    variables: {
                        userId: user_id,
                        conversationId: conversation_id,
                    }
                })
            }
        })
    }),
    graphql(createConversation, {
        props: (props) => ({
            createConversation: (user_id, conversation_id) => {
                props.mutate({
                    variables: {
                        userId: user_id,
                        conversationId: conversation_id,
                    }
                })
            }
        })
    }),
)(CreateConversation)

export default CreateConversationGraphQL;
