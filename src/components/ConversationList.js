import React from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { graphql, compose } from 'react-apollo';

import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';


class ConversationList extends React.Component {

  _navigateToMessages(conversationId) {
    return () => {
      console.log('navigating to ', conversationId)
      this.props.navigation.navigate('Messages', { conversationId })
    }
  }

  _renderItem({ item: { conversation } }) {
    return (
      <TouchableOpacity onPress={ this._navigateToMessages(conversation.id) }>
        <Text>{conversation.name}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    console.log('ConversationList render props: ', this.props)
    const { data: { me, loading, error }, navigation } = this.props;

    if (loading) {
      return <View> <Text> Loading... </Text> </View>;
    }

    return (
      <View>
        <FlatList
          data={me.conversations.userConversations}
          renderItem={this._renderItem.bind(this)} />
        <Button
          onPress={() => navigation.navigate('CreateConversation')}
          title='Create Conversation'/>
      </View>
    )
  }
}

const ConversationListGraphQL = compose(
    graphql(
      getUserConversationsConnection, {
        options: {
          fetchPolicy: 'cache-and-network',
        },
      }
    )
)(ConversationList)

export default ConversationListGraphQL;
