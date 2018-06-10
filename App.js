import React from 'react';
import { View, Text } from 'react-native';

// import Amplify, { Auth } from 'aws-amplify';
// import aws_exports from './src/aws-exports';
// import { withAuthenticator } from 'aws-amplify-react-native';
// // import { createStackNavigator } from 'react-navigation';

// import AWSAppSyncClient from 'aws-appsync';
// import { Rehydrated } from 'aws-appsync-react';
// import appSyncConfig from './src/AppSync.js';
// import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
// import { ApolloProvider } from 'react-apollo';

// import ConversationList from './src/components/ConversationList';
// // import CreateConversation from './src/components/CreateConversation';
// // import Messages from './src/components/Messages';


// Amplify.configure(aws_exports)

// console.disableYellowBox = true;

// const client = new AWSAppSyncClient({
//     url: appSyncConfig.graphqlEndpoint,
//     region: appSyncConfig.region,
//     auth: {
//         type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
//         jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
//     }
// });

// // const AppNavigation = createStackNavigator(
// //     { Conversations: ConversationList },
// //       // CreateConversation: CreateConversation,
// //       // Messages: Messages },
// //     { initialRouteName: 'Conversations'}
// // );

// class withProvidor extends React.Component {
//   render() {
//     return (
//         <ApolloProvider client={client}>
//             <Rehydrated>
//                 <ConversationList />
//             </Rehydrated>
//         </ApolloProvider>
//     );
//   }
// }

// export default withAuthenticator(withProvidor)

const comp = () => (
  <View>
    <Text> hiiii </Text>
  </View>
)

export default comp;
