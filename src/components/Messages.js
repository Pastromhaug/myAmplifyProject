import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { graphql, ApolloProvider, compose, withState } from 'react-apollo';

import { Auth } from 'aws-amplify';

import getConversationMessages from '../graphql/queries/getConversationMessages';
import createMessage from '../graphql/mutations/createMessage';
import getMe from '../graphql/queries/getMe';

import UUIDGenerator, { getRandomUUID } from 'react-native-uuid-generator';


class Messages extends React.Component {

    constructor(props) {
        super(props)
        this.state = { message_text: '' }
    }

    _renderItem(item) {
        return (
            <TouchableOpacity>
                <Text>{item.item.content}</Text>
            </TouchableOpacity>
        )
    }

    async _sendMessage() {
        uuid = await UUIDGenerator.getRandomUUID();
        this.props.createMessage({
            conversationId: this.props.navigation.state.params.conversationId,
            id: uuid,
            createdAt: new Date().getTime(),
            sender: this.props.cognitoId,
            content: this.state.message_text,
        });
    }

    render() {
        return (
            <View>
                <Text> Messages </Text>
                <FlatList
                    data={this.props.messages}
                    renderItem={this._renderItem} />
                <TextInput
                    onChangeText={ (text) => this.setState({ message_text: text }) }
                    value={ this.state.message_text } />
                <Button
                    onPress={() => this._sendMessage()}
                    title='send'/>
            </View>
        )
    }
}

const MessagesGraphQL = compose(
    graphql(getConversationMessages, {
        options: (props) => {
            return {
                fetchPolicy: 'cache-and-network',
                variables: { conversationId: props.navigation.state.params.conversationId },
            }
        },
        props: (props) => {
            console.log('getMessages props: ', props)
            return {
                messages: props.data.allMessageConnection.messages,
            }
        }
    }),
    graphql(createMessage, {
        props: (props) => ({
            createMessage: (args) => {
                console.log('calling createMessage with args: ', args)
                props.mutate({
                    variables: args
                })
            }
        })
    }),
    graphql(getMe, {
        options: { fetchPolicy: 'cache-and-network' },
        props: (props) => {
            return {
                cognitoId: props.data.me.cognitoId,
            }
        }
    }),
)(Messages)

export default MessagesGraphQL;

