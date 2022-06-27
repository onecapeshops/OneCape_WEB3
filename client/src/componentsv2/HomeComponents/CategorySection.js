/* eslint-disable max-len */
import React from 'react';
import PropTypes, { array, object } from 'prop-types';
import { Box, Typography, ButtonBase, makeStyles, Avatar } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useHistory } from 'react-router-dom';
import * as colors from '../../uicontants';
import { CategorySkeleton } from './HomeSkeletons';

const PLACEHOLDER = require('../../assets/images/placeholder.png');

const useStyles = makeStyles(() => ({
  categoryWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: colors.LIGHT_100,
    padding: 10,
    marginTop: 10,
  },
  categoryContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: "space-evenly",
    marginTop: 10,
    flexWrap: 'wrap',
  },
  categoryChip: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const CategorySection = ({ categories, currentOutlet }) => {
  const classes = useStyles();
  const history = useHistory();
  const generalCategory =
    currentOutlet &&
    currentOutlet.oneCapeShopId &&
    currentOutlet.oneCapeShopId === '8f14ffff-c4f2-4634-ae00-2c85d25ab10d'
      ? [
          {
            category: 'Home Needs',
            imageUrl:
              'https://res.cloudinary.com/onecape/image/upload/fl_lossy,f_auto,q_auto,f_webp,h_208,w_208,c_fit/v1621539612/Grocery/shop_image_t9wlxz.jpg',
          },
          {
            category: 'Instant foods',
            imageUrl:
              'https://res.cloudinary.com/onecape/image/upload/fl_lossy,f_auto,q_auto,f_webp,h_208,w_208,c_fit/v1639462299/Grocery/instant_k82vuf.jpg',
          },
          {
            category: 'Snacks',
            imageUrl:
              'https://res.cloudinary.com/onecape/image/upload/fl_lossy,f_auto,q_auto,f_webp,h_208,w_208,c_fit/v1639462299/Grocery/snacks_om3lzs.jpg',
          },
          {
            category: 'Beverages',
            imageUrl:
              'https://res.cloudinary.com/onecape/image/upload/fl_lossy,f_auto,q_auto,f_webp,h_208,w_208,c_fit/v1639462299/Grocery/drinks_hn26pc.jpg',
          },
          {
            category: 'Cleaning & Household',
            imageUrl:
              'https://res.cloudinary.com/onecape/image/upload/fl_lossy,f_auto,q_auto,f_webp,h_208,w_208,c_fit/v1639462299/Grocery/cleaning_oz09yh.jpg',
          },
          {
            category: 'Cooking Essentials',
            imageUrl:
              'https://res.cloudinary.com/onecape/image/upload/fl_lossy,f_auto,q_auto,f_webp,h_208,w_208,c_fit/v1639462299/Grocery/foodgrains_iop2g9.jpg',
          },
          {
            category: 'Cigarette',
            imageUrl:
              'https://res.cloudinary.com/onecape/image/upload/fl_lossy,f_auto,q_auto,f_webp,h_208,w_208,c_fit/v1639462299/Grocery/cigarettes_lncxeb.jpg',
          },
          {
            category: 'Personal Care',
            imageUrl:
              'https://res.cloudinary.com/onecape/image/upload/fl_lossy,f_auto,q_auto,f_webp,h_208,w_208,c_fit/v1639462298/Grocery/beauty_muzt0l.jpg',
          },
        ]
      : categories;

  const goToProducts = category => {
    const { oneCapeShopName, shopOnline, oneCapeShopId } = currentOutlet;
    history.push(`/list/${oneCapeShopName}/${oneCapeShopId}`, {
      shopId: oneCapeShopId,
      from: 'home',
      status: shopOnline,
      category,
    });
  };
  return (
    <Box className={classes.categoryWrapper}>
      <Typography variant="body1" style={{ marginTop: 10, marginLeft: 10 }}>
        Categories
      </Typography>
      <Box className={classes.categoryContainer}>
        {!(generalCategory === 'nodata') && generalCategory?.length
          ? generalCategory.map(item => {
              return (
                <ButtonBase
                  style={{ borderRadius: 10 }}
                  onClick={() => goToProducts(item.category)}
                >
                  <Box className={classes.categoryChip} key={item.id}>
                    <Avatar
                      variant="rounded"
                      src={item.imageUrl ? item.imageUrl : PLACEHOLDER}
                      style={{ width: 96, height: 96, borderRadius: 10 }}
                    />
                    <Typography
                      variant="h6"
                      style={{
                        marginTop: 5,
                        // whiteSpace: "nowrap",
                        width: '80px',
                        textAlign: 'center',
                        // overflow: "hidden",
                        // textOverflow: "ellipsis",
                      }}
                      className={classes.overflow}
                    >
                      {item.category}
                    </Typography>
                  </Box>
                </ButtonBase>
              );
            })
          : !(generalCategory === 'nodata') && <CategorySkeleton />}
        <ButtonBase style={{ borderRadius: 10 }} onClick={() => goToProducts('All')}>
          <Box className={classes.categoryChip}>
            <Avatar
              variant="rounded"
              style={{
                width: 96,
                height: 96,
                backgroundColor: colors.LIGHT_300,
                borderRadius: 10,
              }}
            >
              <NavigateNextIcon style={{ color: colors.DARK_200, fontSize: 48 }} />
            </Avatar>
            <Typography variant="h6" style={{ marginTop: 5 }}>
              View All
            </Typography>
          </Box>
        </ButtonBase>
      </Box>
    </Box>
  );
};

export default CategorySection;

CategorySection.propTypes = {
  currentOutlet: PropTypes.shape(object).isRequired,
  categories: PropTypes.shape(array).isRequired,
};
