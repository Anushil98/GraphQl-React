import React from "react";
// import logo from './logo.svg';
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
      comment: "",
      comments: [],
    };
  }
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addComment = (e, post_id) => {
    e.preventDefault();
    client
      .mutate({
        mutation: gql`
          mutation addComment(
            $comment: String!
            $post_id: ID!
            $commentor_id: String!
          ) {
            addComment(
              comment: $comment
              post_id: $post_id
              commentor_id: $commentor_id
            ) {
              message
              status
            }
          }
        `,
        variables: {
          comment: this.state.comment,
          post_id: post_id,
          commentor_id: this.props.getCurrentUser(),
        },
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    client
      .query({
        query: gql`
          query viewComment($post_id: ID!) {
            viewComment(post_id: $post_id) {
              comment
              _id
            }
          }
        `,
        variables: {
          post_id: this.props.post_id,
        },
      })
      .then((result) => {
        console.log(result.data.viewComment,"asajshh")
        if(result.data.viewComment.length>0){
          this.setState({comments:[...result.data.viewComment]})
        }
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <div>
        <div>
          <form onSubmit={(e) => this.addComment(e, this.props.post_id)}>
            <input
              class="comment"
              type="text"
              name="comment"
              value={this.state.comment}
              onChange={this.changeHandler}
            />
            <input class="commentButton" type="Submit" value="comment" />
          </form>
          <div class="comment">
            {this.state.comments.length > 0
              ? this.state.comments.map((comm) => {
                  return(<div key={comm._id}>
                    <p>{comm.comment}</p>
                  </div>);
                })
              : null}
          </div>
        </div>
      </div>
    );
  }
}
