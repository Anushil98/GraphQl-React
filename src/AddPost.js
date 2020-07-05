import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
const client = new ApolloClient({
  uri: "http://127.0.0.1:4000/graphql",
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title:"",
      content:""
    };
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addPost = (e) => {
    e.preventDefault();

    client
      .mutate({
        mutation: gql`
          mutation addPost($title: String!, $content: String!,$user_id:String!) {
            addPost(title:$title,content:$content,user_id:$user_id) {
              message
            }
          }
        `,
        variables: {
          title:this.state.title,
          content:this.state.content,
          user_id:this.props.getCurrentUser()
        },
      })
      .then((result) => {console.log(result);this.props.reload()})
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        <div>
          <form onSubmit={this.addPost}>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.changeHandler}
            />
            <textarea
              name="content"
              value={this.state.content}
              onChange={this.changeHandler}
            />
            <input class="InputButton" type="submit" value="Add Post" />
          </form>
        </div>
      </div>
    );
  }
}
