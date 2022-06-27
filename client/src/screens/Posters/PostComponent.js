import React, { useState } from 'react';
import { Avatar, Box, makeStyles, Typography } from '@material-ui/core';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import CommentComponent from './CommentComponent';
import * as colors from '../../uicontants';
import Happening from '../../images/happening.png';

const useStyles = makeStyles(() => ({
    postersSection: {
      backgroundColor: colors.LIGHT_100,
    },
    posterWrapper: {
      padding: '2px 0',
      borderBottom: '1px solid #ffffff',
    boxShadow: '0px 1px 2px rgb(0 0 0 / 15%)',
    },
    headerWrapper: {
      display: 'flex',
      margin: 14,
    },
    headerSection: {
      marginLeft: 10,
    },
    posters: {
      width: '100%',
      height: 'auto',
    },
    titleLikesWrappper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0 0',
    },
    likeSection: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: 600,
      color: colors.DARK_400,
    },
    content: {
      padding: '0 12px 0',
    },
  }));

const PostComponent = props => {
    const classes = useStyles();
    const [isLiked, setIsLiked] = useState(false);
    return (
        <Box className={classes.posterWrapper}>
          <Box className={classes.headerWrapper}>
            <Avatar />
            <Box className={classes.headerSection}>
              <Typography variant="body1" style={{ color: colors.DARK_500 }}>
                Restaruant
              </Typography>
              <Typography variant="h6" style={{ color: colors.DARK_300 }}>
                a day ago
              </Typography>
            </Box>
          </Box>
          <img className={classes.posters} src={Happening} alt="Happening Post" />
          <Box className={classes.content}>
            <Box className={classes.titleLikesWrappper}>
              <Typography className={classes.title}>Tasty starters at 299 only</Typography>
              <Box className={classes.likeSection} onClick={() => setIsLiked(!isLiked)}>
                {isLiked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
                <Typography variant="h6" style={{ color: colors.DARK_500, paddingLeft: 6 }}>
                  23.2K Likes
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" style={{ color: colors.DARK_300, paddingTop: 4 }}>
              Lörem ipsum abelogi jibuvis suprade, pokaning dimisat.{' '}
            </Typography>
            <Box className={classes.commentSection} onClick={() => props.mockComments.length > 2 && props.history.push('/happenings/comments')}>
              <Typography variant="body1" style={{ color: colors.DARK_500, padding: '8px 0' }}>
                Comments
              </Typography>
              {props.mockComments?.slice(0, 2).map(item => (
                <CommentComponent comment={item} />
              ))}
            </Box>
          </Box>
        </Box>
    )
}

export default PostComponent;