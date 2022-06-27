import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import * as colors from '../../uicontants';
import SecondaryLayout from '../../components/SecondaryLayout';
import PostComponent from './PostComponent';

const useStyles = makeStyles(() => ({
  postersSection: {
    backgroundColor: colors.LIGHT_100,
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

const Posters = props => {
  const classes = useStyles();
  return (
    <SecondaryLayout title="Happenings" route={props} fromProfile>
      <Box className={classes.postersSection}>
         {[1,2].map(() => <PostComponent {...props} mockComments={mockComments} /> )}
      </Box>
    </SecondaryLayout>
  );
};

export default Posters;
