import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import AddComment from "./addComment";
const client = new ApolloClient({
  uri: "http://127.0.0.1:4000/graphql",
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
    this.input = React.createRef();
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount = () => {
    client
      .query({
        query: gql`
          {
            viewPost {
              title
              content
              _id
            }
          }
        `,
        variables: {},
      })
      .then((result) => {
        this.setState({ posts: [...result.data.viewPost] });
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        <div class = "list">
          {this.state.posts.length > 0 ? (
            this.state.posts.map((post) => {
              return (
                <div key={post._id} class="post">
                  <h3>{post.title}</h3>
                  <br></br>
                  <p>{post.content}</p>
                  <AddComment
                    post_id={post._id}
                    getCurrentUser={this.props.getCurrentUser}
                  />
                </div>
              );
            })
          ) : (
            <p>No Posts</p>
          )}
        </div>
      </div>
    );
  }
}
