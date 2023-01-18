import { Grid, IconButton, Paper, Typography, ButtonBase } from "@mui/material";
import { Post } from "../API";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useRouter } from "next/router";

interface PostReviewProps {
  post: Post;
}

const PostReview = ({ post }: PostReviewProps) => {
  const router = useRouter();

  const convertToElapsed = (date: string) => {
    const now = new Date(Date.now());
    const current = new Date(date);

    return ((now.getTime() - current.getTime()) / 1000 / 60 / 60).toFixed(0);
  };

  return (
    <Paper elevation={3}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        wrap="nowrap"
        spacing={3}
        style={{ padding: 12, marginTop: 24 }}
      >
        <Grid item maxWidth={128}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <IconButton>
                <ArrowUpward color="info" />
              </IconButton>
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Typography variant="h6">
                  {(post.upvotes - post.downvotes).toString()}
                </Typography>
                <Typography variant="body2">votes</Typography>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton>
                <ArrowDownward color="info" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <ButtonBase onClick={() => router.push(`/post/${post.id}`)}>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <Typography variant="body1">
                  Posted by <b>{post.owner}</b>{" "}
                  {convertToElapsed(post.createdAt)} hours ago
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h2">{post.title}</Typography>
              </Grid>
              <Grid item style={{ maxHeight: 32, overflow: "hidden" }}>
                <Typography variant="body1">{post.contents}</Typography>
              </Grid>
              {post.image && (
                <Grid item>
                  <Image src={post.image} alt="" height={480} />
                </Grid>
              )}
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostReview;
