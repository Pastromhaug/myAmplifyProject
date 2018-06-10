import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import { Auth } from 'aws-amplify';

import createUser from '../graphql/mutations/createUser';
import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import createUserConversations from '../graphql/mutations/createUserConversations';
import createConversation from '../graphql/mutations/createConversation';
import getMe from '../graphql/queries/getMe';

import UUIDGenerator, { getRandomUUID } from 'react-native-uuid-generator';


class CreateConversation extends React.Component {

    constructor(props) {
        super(props);
        this.state = { group_name: 'Group Name' };
    }

    async _createUserConversation() {
        uuid = await UUIDGenerator.getRandomUUID()
        this.props.createConversation({
            name: this.state.group_name,
            id: uuid
        })
        this.props.createUserConversations({
            userId: this.props.cognitoId,
            conversationId: uuid
        })
        this.props.navigation.navigate('Conversations')
    }

    render() {
        return (
            <View>
                <TextInput
                    onChangeText={ (text) => this.setState({ group_name: text }) }
                    value={ this.state.group_name }
                  />
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
            createUserConversations: (args) => {
                props.mutate({
                    variables: args
                })
            }
        })
    }),
    graphql(createConversation, {
        props: (props) => ({
            createConversation: (args) => {
                props.mutate({
                    variables: args
                })
            }
        })
    }),
)(CreateConversation)

export default CreateConversationGraphQL;
