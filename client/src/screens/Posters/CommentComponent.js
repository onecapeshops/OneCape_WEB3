import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import * as colors from '../../uicontants';

const useStyles = makeStyles(() => ({
  commentWrapper: {
    display: 'flex',
    alignItems: 'start',
    paddingBottom: 6,
  },
}));

const CommentComponent = ({ comment }) => {
  const classes = useStyles();
  const { name, desc } = comment;
  return (
    <Box className={classes.commentWrapper}>
      <Typography variant="body1" style={{ color: colors.DARK_300 }}>
        {`${name}:`}
      </Typography>
      <Typography variant="h6" style={{ color: colors.DARK_300, paddingLeft: 2 }}>
        {desc}
      </Typography>
    </Box>
  );
};

export default CommentComponent;
