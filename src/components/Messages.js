import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { graphql, ApolloProvider, compose, withState } from 'react-apollo';

import { Auth } from 'aws-amplify';

import getConversationMessages from '../graphql/queries/getConversationMessages';


class Messages extends React.Component {

    constructor(props) {
        super(props)
        this.state = { message_text: '' }
    }

    _renderItem(item) {
        return (
            <TouchableOpacity>
                <Text>{item.toString()}</Text>
            </TouchableOpacity>
        )
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
                    value={ this.state.message_text }
                  />
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
            console.log('getConversationMessage props: ', props)
            return {
                messages: '',
            }
        }
    }),
)(Messages)

export default MessagesGraphQL;

