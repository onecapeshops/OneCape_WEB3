import React, { useState } from 'react';
import { Typography, Box, makeStyles, OutlinedInput, InputAdornment } from '@material-ui/core';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import SendIcon from '@material-ui/icons/Send'
import * as colors from '../../uicontants';
import SecondaryLayout from '../../components/SecondaryLayout';
import CommentComponent from './CommentComponent';

const useStyles = makeStyles(() => ({
  commentWrapper: {
      backgroundColor: '#ffffff'
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
    height: 900
  },
  inputField: {
    position: 'absolute',
    width: 360,
    height: 56,
    marginLeft: 8,
    bottom: 8,
    backgroundColor: colors.LIGHT_300,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent'
    }
  },
  sendBtn: {
    borderRadius: 10,
    background: colors.PRIMARY,
    padding: '16px 6px',
    color: colors.LIGHT_100
  }
}));

const mockComments = [
  {
    name: 'Amba',
    desc: 'Lörem ipsum abelogi jibuvis suprade, pokaning dimisat',
  },
  {
    name: 'Dinesh',
    desc: 'Lörem ipsum abelogi jibuvis suprade, pokaning dimisat. Lörem ipsum abelogi',
  },
  {
    name: 'Arch',
    desc: 'Lörem ipsum abelogi jibuvis suprade, pokaning dimisat',
  },
];

const Comments = props => {
  const classes = useStyles();
  const [isLiked, setIsLiked] = useState(false);
  return (
    <SecondaryLayout title="Comments" route={props} fromProfile>
      <Box className={classes.commentWrapper}>
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
          <Box className={classes.commentSection}>
            <Typography variant="body1" style={{ color: colors.DARK_500, padding: '8px 0' }}>
              Comments
            </Typography>
            {mockComments.map(item => (
              <CommentComponent comment={item} />
            ))}
          </Box>
        </Box>
        <OutlinedInput fullWidth variant="outlined" placeholder="Type something..." className={classes.inputField} endAdornment={<InputAdornment position="end" className={classes.sendBtn}><SendIcon /></InputAdornment>} />
      </Box>
    </SecondaryLayout>
  );
};

export default Comments;
