import React from 'react';
import { View } from 'react-native';
import { graphql, compose } from 'react-apollo';

// import { Auth } from 'aws-amplify';

// import createUser from '../graphql/mutations/createUser';
// import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import getMe from '../graphql/queries/getMe';


class ConversationList extends React.Component {

    render() {
        console.log('conversationList render props: ', this.props.data)
        return (
            <View>
              hiii
            </View>
        )
    }
}

const ConversationListGraphQL = compose(
    graphql(getMe),
)(ConversationList)

export default ConversationListGraphQL;
