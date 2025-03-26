import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect } from "react";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_oDBGh8hef",
      userPoolClientId: "171uojgfrbv775ultuqk12os85",
    },
  },
});

function CognitoSignIn(props: { dispatch: Dispatch<AppEvent> }) {
  const dispatch = props.dispatch;

  const SignedIn = () => {
    useEffect(() => {
      fetchAuthSession().then((s) => {
        if (s.tokens && s.tokens.idToken) {
          dispatch({
            type: EventType.UserAuthenticated,
            idToken: s.tokens.idToken.toString(),
          });
        }
      });
    }, []);

    return <div></div>;
  };

  // TODO: allow signing out
  return (
    <Authenticator loginMechanisms={["email"]}>
      {(/*{ signOut, user }*/) => <SignedIn />}
    </Authenticator>
  );
}

export default CognitoSignIn;
