import React from 'react';
import { Box, ButtonBase, Avatar } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import HomeStyles from '../../screens/Home/HomeStyles';
import * as colors from '../../uicontants';

const DashboardSkeleton = () => {
  const classes = HomeStyles();
  return (
    <Box className={classes.shopWrapper}>
      <Box className={classes.shopInnerWrapper}>
        <Box className={classes.innerWrapper} width="100%">
          <Skeleton
            animation="pulse"
            variant="rect"
            width="30%"
            style={{ borderRadius: 10 }}
            height={20}
          />
          <Skeleton
            animation="pulse"
            variant="rect"
            width="80%"
            height={10}
            style={{ marginTop: 15, borderRadius: 10 }}
          />
          <Skeleton
            animation="pulse"
            variant="rect"
            width="40%"
            height={10}
            style={{ marginTop: 5, borderRadius: 10 }}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          width="30%"
          // color={colors.SECONDARY}
          // padding={20}
        >
          <Skeleton
            animation="pulse"
            variant="rect"
            style={{ borderRadius: 10 }}
            width="80%"
            height={20}
          />
        </Box>
      </Box>

      <Box className={classes.shopStatusBar}>
        <Box className={classes.shopStatusAlign} width="60%">
          <Skeleton animation="pulse" variant="rect" width="100%" style={{ borderRadius: 10 }} />
          <Skeleton
            variant="rect"
            animation="pulse"
            width="100%"
            height={5}
            style={{ borderRadius: 10, margin: 10 }}
          />
        </Box>
        <Box border={`.5px solid ${colors.LIGHT_500}`} height="3vh" />
        <Box className={classes.shopStatusAlign} width="60%">
          <Skeleton animation="pulse" variant="rect" width="100%" style={{ borderRadius: 10 }} />
          <Skeleton
            variant="rect"
            animation="pulse"
            width="100%"
            height={5}
            style={{ borderRadius: 10, margin: 10 }}
          />
        </Box>
        <Box border={`.5px solid ${colors.LIGHT_500}`} height="3vh" />
        <Box className={classes.shopStatusAlign} width="60%">
          <Skeleton animation="pulse" variant="rect" width="100%" style={{ borderRadius: 10 }} />
          <Skeleton
            variant="rect"
            animation="pulse"
            width="100%"
            height={5}
            style={{ borderRadius: 10, margin: 10 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const CategorySkeleton = () => {
  const classes = HomeStyles();
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => {
    return (
      <ButtonBase style={{ borderRadius: 10 }}>
        <Box className={classes.categoryChip} key={item.id}>
          <Skeleton animation="pulse" style={{ borderRadius: 10 }}>
            <Avatar
              variant="rounded"
              // src={item.imageUrl}
              style={{ width: 96, height: 144 }}
            />
          </Skeleton>
          <Skeleton
            animation="pulse"
            style={{ borderRadius: 10 }}
            variant="rect"
            width="80%"
            height={20}
          />
        </Box>
      </ButtonBase>
    );
  });
};

const OutletListingSkeleton = () => {
  return [1, 2, 3, 4].map(() => (
    <ButtonBase
      style={{
        borderRadius: 15,
        borderBottom: `1px solid ${colors.LIGHT_100}`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 15,
        }}
      >
        <Skeleton animation="pulse">
          <Avatar variant="rounded" style={{ width: 48, height: 72 }} />
        </Skeleton>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'flex-start',
            marginLeft: 15,
          }}
        >
          <Skeleton animation="pulse" width="40%" height={20} />
          <Skeleton animation="pulse" width="80%" height={10} style={{ marginTop: 10 }} />
        </Box>
      </Box>
    </ButtonBase>
  ));
};

export { DashboardSkeleton, CategorySkeleton, OutletListingSkeleton };
