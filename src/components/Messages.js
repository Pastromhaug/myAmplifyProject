import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { graphql, ApolloProvider, compose, withState } from 'react-apollo';

import { Auth } from 'aws-amplify';

import getConversationMessages from '../graphql/queries/getConversationMessages';
import createMessage from '../graphql/mutations/createMessage';
import getMe from '../graphql/queries/getMe';
import subscribeToNewMessages from '../graphql/subscriptions/subscribeToNewMessages';

import UUIDGenerator, { getRandomUUID } from 'react-native-uuid-generator';


class Messages extends React.Component {

    constructor(props) {
        super(props)
        this.state = { message_text: '' }
    }

    componentWillReceiveProps(nextProps) {
      if(!nextProps.data.loading) {
        if (this.unsubscribe) return;
        console.log('componentWillReceiveProps props: ', nextProps)
        this.unsubscribe = nextProps.data.subscribeToMore({
          document: subscribeToNewMessages,
          variables: { conversationId: nextProps.navigation.state.params.conversationId },
          updateQuery: (previousResult, { subscriptionData, variables }) => {
            console.log('subscription: ', subscriptionData);
            console.log('previousResult', previousResult);

            newProps = {
              ...previousResult,
              allMessageConnection: {
                ...previousResult.allMessageConnection,
                messages: [
                  subscriptionData.data.subscribeToNewMessage,
                  ...previousResult.allMessageConnection.messages,
                ]
              }
            }

            console.log('newProps: ', newProps);
            return newProps;
          }
        });
      }
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
            content: this.state.message_text,
        });
    }

    render() {
        // console.log('Messages render props :', this.props)
        const { data, loading } = this.props;
        if (loading) {
          return (
            <View>
              <Text> Loading... </Text>
            </View>
          )
        }

        const { allMessageConnection: { messages } } = data;
        return (
            <View>
                <Text> Messages </Text>
                <FlatList
                    data={messages}
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
                variables: { conversationId: props.navigation.state.params.conversationId },
                fetchPolicy: 'cache-and-network',
            }
        },
    }),
    graphql(createMessage, {
        props: (props) => ({
            createMessage: (args) => {
                console.log('in createMessage', args)
                props.mutate({
                    variables: args
                }).then( result => {
                  console.log('createMessage result: ', result);
                }).catch( err => {
                  console.log('createMessage error: ', err);
                })
            }
        })
    }),
)(Messages)

export default MessagesGraphQL;

