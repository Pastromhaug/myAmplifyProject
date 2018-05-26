import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { graphql, ApolloProvider, compose } from 'react-apollo';

import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import createUserConversations from '../graphql/mutations/createUserConversations';
// import createConversation from '../graphql/mutations/createConversation';
import getMe from '../graphql/queries/getMe';


class ConversationList extends React.Component {

    _createUserConversation() {
        console.log('_createUserConversation')
        this.props.createUserConversations(
            this.props.cognitoId,
            'convo ID',
        )
    }

    render() {

        console.log('ConversationList render props: ', this.props);

        return (
            <View style={styles.container}>
                <Text>hiiiiyyyy. Open up App.js to start working on your app!</Text>
                <Text>Changes you make will automatically reload.</Text>
                <Text>Shake your phone to open the developer menu.</Text>
                <Button
                    onPress={() => this._createUserConversation()}
                    title='Create Conversation' />
            </View>
        )
    }
}

const ConversationListGraphQL = compose(
    graphql(getMe, {
        options: {
            fetchPolicy: 'cache-and-network'
        },
        props: (props) => {
            console.log('getMe props: ', props)
            return {
                cognitoId: props.data.me.cognitoId,
            }
        }
    }),
    graphql(getUserConversationsConnection, {
        options: {
            fetchPolicy: 'cache-and-network'
        },
        props: (props) => {
            // console.log('getUserConversationConnection props: ', props)
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
    // graphql(createUser, {
    //     props: (props) => ({
    //         createUser: (user) => {
    //             console.log('createUse session', user);
    //             props.mutate({
    //                 variables: {
    //                     username: user.username,
    //                     id: user.id,
    //                     cognitoId: user.cognitoId,
    //                     registered: false
    //                 }
    //             }).then( data => console.log('createUser data: ', data))
    //         }
    //     })
    // }),
)(ConversationList)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ConversationListGraphQL;
