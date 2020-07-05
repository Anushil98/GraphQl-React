import React from "react";
// import logo from './logo.svg';
import "./App.css";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
const client = new ApolloClient({
  uri: "http://127.0.0.1:4000/graphql",
});

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  loginUser = (e) => {
    e.preventDefault();

    client
      .mutate({
        mutation: gql`
          mutation login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              message
              _id
              status
            }
          }
        `,
        variables: {
          username: this.state.username,
          password: this.state.password,
        },
      })
      .then((result) => {
          if(result.data.login.status === 200){
              this.props.setCurrentUser(result.data.login._id)
              console.log("Logged In succesfully")
              console.log("Current User is:",this.props.getCurrentUser())
          }else{
              console.log("Credentials are wrong")
          }
      })
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <div>
        <div>
          <form onSubmit={this.loginUser}>
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.changeHandler}
            />
            <input
              type="text"
              name="password"
              value={this.state.password}
              onChange={this.changeHandler}
            />
            <input class="InputButton" type="submit" value="Login" />
          </form>
        </div>
      </div>
    );
  }
}
