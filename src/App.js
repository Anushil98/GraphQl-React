import React from "react";
// import logo from './logo.svg';
import "./App.css";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import Login from "./login";
import AddPost from "./AddPost";
import PostList from "./PostList";
const client = new ApolloClient({
  uri: "http://127.0.0.1:4000/graphql",
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      currentUser: "",
    };
  }
  setCurrentUser = (id) => {
    this.setState({ currentUser: id });
  };
  getCurrentUser = () => {
    return this.state.currentUser;
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addUser = (e) => {
    e.preventDefault();

    client
      .mutate({
        mutation: gql`
          mutation addUser($username: String!, $password: String!) {
            addUser(username: $username, password: $password) {
              message
            }
          }
        `,
        variables: {
          username: this.state.username,
          password: this.state.password,
        },
      })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div class="Main">
        <div class="signup">
          <form onSubmit={this.addUser}>
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
            <input class="InputButton" type="submit" value="SignUp" />
          </form>
        </div>
        <div class="login">
          {this.state.currentUser===""?<p>Please login</p>:null}
          <Login
            setCurrentUser={this.setCurrentUser}
            getCurrentUser={this.getCurrentUser}
          />
        </div>
        <div class="addpost">
          {this.state.currentUser !== "" ? (
            <AddPost
              getCurrentUser={this.getCurrentUser}
            />
          ) : null}
        </div>
        <div class="postlist">
          {this.state.currentUser !== "" ? (
            <PostList getCurrentUser={this.getCurrentUser} />
          ) : null}
        </div>
      </div>
    );
  }
}
