import { makeStyles } from '@material-ui/core';
import * as colors from '../../uicontants';
import COLLECTION_BG from '../../images/collection.png';

const CollectionStyles = makeStyles(() => ({
  collectionWrapper: {
    backgroundImage: `url(${COLLECTION_BG})`,
    height: 169,
    imageRendering: 'pixelated',
  },
  headerWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '18px 10px',
  },
  shopName: {
    fontWeight: '600',
    fontSize: 24,
    color: colors.LIGHT_100,
    paddingLeft: 12,
    paddingTop: 4,
  },
  tabs: {
    marginTop: 38,
    color: colors.LIGHT_100,
    '& .PrivateTabIndicator-colorSecondary-12': {
      // width: "90px !important",
      border: `2px solid ${colors.PRIMARY}`,
      // left: "43px !important",
      borderRadius: 2,
    },
    '& .Mui-selected': {
      background: 'linear-gradient(180deg, rgba(45, 55, 72, 0) 0%, #2D3748 100%)',
    },
  },
  dropSection: {
    padding: '24px 12px',
    backgroundColor: colors.DARK_500,
    minHeight: 900,
  },
  marketSection: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '24px 0 24px 12px',
    backgroundColor: colors.DARK_500,
    flexWrap: 'wrap',
    minHeight: 900,
  },
  rentSection: {
    textAlign: 'center',
    paddingTop: '20%',
    color: colors.LIGHT_100,
    backgroundColor: colors.DARK_500,
    minHeight: 900,
  },
}));

export default CollectionStyles;
