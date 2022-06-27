import { makeStyles } from '@material-ui/core';
import * as colors from '../../uicontants';
import ASSET_BG from '../../images/asset.png';

const AssetStyles = makeStyles(() => ({
  imageWrapper: {
    backgroundImage: `url(${ASSET_BG})`,
    height: 180,
    imageRendering: 'pixelated',
  },
  dropAvatar: {
    width: '65%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 10
  },
  bodyWrapper: {
    backgroundColor: colors.DARK_400,
    minHeight: 900
  },
  imageContent: {
    position: 'relative',
    bottom: 130,
    textAlign: 'center',
  },
  nftName: {
    fontSize: 24,
    fontWeight: 600,
    color: colors.LIGHT_100,
    padding: '8px 0',
  },
  nftDesc: {
    color: colors.LIGHT_100,
    padding: '18px 8px',
  },
  nftRate: {
    fontSize: 28,
    fontWeight: 600,
    color: colors.LIGHT_100,
  },
  actionBtn: {
    width: '90%',
    backgroundColor: colors.PRIMARY,
    borderRadius: 6,
    color: colors.LIGHT_100,
    marginTop: 10,
  },
}));

export default AssetStyles;
