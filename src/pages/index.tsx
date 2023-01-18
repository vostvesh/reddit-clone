import { Container, Typography } from "@mui/material";
import { API } from "aws-amplify";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { Post, ListPostsQuery } from "../API";
import PostReview from "../components/PostReview";
import { useUser } from "../context/AuthContext";
import { listPosts } from "../graphql/queries";

const Home = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async () => {
      const allPosts = (await API.graphql({ query: listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };
      if (allPosts.data) {
        setPosts(allPosts.data.listPosts?.items as Post[]);
      } else {
        throw new Error("Could not get posts");
      }
    };
    fetchPostsFromApi();
  }, []);

  console.log(posts);

  return (
    <Container maxWidth="md">
      {posts.map((post) => (
        <PostReview key={post.id} post={post} />
      ))}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Home;
