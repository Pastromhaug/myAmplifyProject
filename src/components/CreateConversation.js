import React from 'react';
import { Button, FlatList, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { graphql, compose } from 'react-apollo';

import createUserConversations from '../graphql/mutations/createUserConversations';
import createConversation from '../graphql/mutations/createConversation';
import getMe from '../graphql/queries/getMe';
import getAllUsers from '../graphql/queries/getAllUsers';

import UUIDGenerator from 'react-native-uuid-generator';


class CreateConversation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      group_name: 'Group Name',
      users: [],
    };
  }

  async _createUserConversation() {
    const   conversationId = await UUIDGenerator.getRandomUUID()
    this.props.createConversation({
      name: this.state.group_name,
      id: conversationId
    })
    console.log('this.state.users: ', this.state.users)
    const cognitoIds = this.state.users.map(user => user.cognitoId);
    console.log('_createUserConversation cognitoIds: ', cognitoIds)
    for (let i = 0; i < cognitoIds.length; i += 1) {
      this.props.createUserConversations({
        userId: cognitoIds[i],
        conversationId: conversationId,
      })
    }

    this.props.navigation.navigate('Conversations')
  }

  _renderSelectableUser({ item: user }) {
    return (
      <TouchableOpacity onPress={ () => this._addUserToGroup(user) }>
        <Text>{ user.username }</Text>
      </TouchableOpacity>
    )
  }

  _renderSelectedUser( { item: user }) {
    return (
      <Text>{ user.username }</Text>
    )
  }

  _updateGroupName(text) {
    this.setState({
      ...this.state,
      group_name: text
    })
  }

  _addUserToGroup(user) {
    this.setState({
      ...this.state,
      users: [...this.state.users, user],
    })
  }

  render() {
    console.log('createConversation props: ', this.props)
    console.log('createConversation state: ', this.state)
    return (
      <View>
        <TextInput
          onChangeText={ this._updateGroupName.bind(this) }
          value={ this.state.group_name }
        />
        <Text> { '    Selected Users' }</Text>
        <FlatList
          data={ this.state.users }
          renderItem={ this._renderSelectedUser.bind(this) }
        />
        <Text> { '    Available Users' }</Text>
        <FlatList
          data={ this.props.allUsers }
          renderItem={ this._renderSelectableUser.bind(this) }
        />
        <Button
          onPress={() => this._createUserConversation()}
          title='Create Conversation'
        />
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
  graphql(getAllUsers, {
    options: { fetchPolicy: 'cache-and-network' },
    props: (props) => ({
      allUsers: props.data.allUser,
    })
  }),
  graphql(createUserConversations, {
    props: (props) => ({
      createUserConversations: (args) => {
        console.log('createUserConversation with args: ', args)
        return props.mutate({
          variables: args
        })
      }
    })
  }),
  graphql(createConversation, {
    props: (props) => ({
      createConversation: (args) => {
        return props.mutate({
          variables: args
        })
      }
    })
  }),
)(CreateConversation)

export default CreateConversationGraphQL;
