/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as colors from '../../uicontants';

const useStyles = makeStyles(() => ({
    dialogWrapper: {
        '& .MuiPaper-root': {
            backgroundColor: colors.DARK_400,
            color: colors.LIGHT_100,
            width: 600
        }
    },
    dialogTitle: {
        padding: 14,
        '& .MuiTypography-root': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }
    }
  }));

const Popup = ({ open, children, onClose, title }) => {
    const classes = useStyles();
  const [isOpen, setIsOpen] = useState(open);
  const handleClose = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Dialog onClose={handleClose} open={isOpen} className={classes.dialogWrapper}>
      <DialogTitle className={classes.dialogTitle}>
        <Typography style={{ fontSize: 16, fontWeight: 700 }}>{title}</Typography>
        {onClose ? (
          <IconButton
            onClick={onClose}
            style={{ color: colors.LIGHT_100 }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent dividers>
          {children}
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
