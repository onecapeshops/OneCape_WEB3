/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import {
  Box,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
// import { actions } from '../../actions/index';
import Loader from '../../components/Loader';

// const ownerNumber = '9677732740';

const DialogProp = ({ open, content, title, action, handleClose, actionTitle }) => {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(!open)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`${title}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => action(true)} color="primary" autoFocus>
          {actionTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Splash = props => {
  // const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [error] = useState(false);

  const handleLocation = () => {
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'granted') {
        window.location.reload();
      } else {
        setOpen(true);
      }
    });
  };

  useEffect(() => {
    // dispatch(
    //   actions.prechechAction(callback => {
    //     if (callback === 200) {
    //       props.history.push('/home');
    //     } else if (callback === 400) {
    //       setError(true);
    //     }
    //   }),
    // );
    props.history.push('/');
  }, [props]);

  return (
    <Box>
      <Loader />
      <DialogProp
        open={open}
        action={e => e && handleLocation}
        content="Let Google help apps determine location. 
        This means sending anonymous location data to
            Google, even when no apps are running."
        title="Location Access!"
        actionTitle="Allow"
      />
      <DialogProp
        open={error}
        action={e => e && window.location.reload()}
        content="Sorry for your Inconvinence, Something Went Wrong!"
        title="Location Access!"
        actionTitle="Reload"
      />
    </Box>
  );
};

export default Splash;
