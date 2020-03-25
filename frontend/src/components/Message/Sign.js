import React from 'react';
import { connect } from 'react-redux';
import * as mapDispatchToProps from 'actions';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper } from '@material-ui/core';
import { stringToHex, numberToHex } from '@etclabscore/eserialize';

const useStyles = makeStyles(theme => ({
  result: {
    padding: 20,
  },
  row: {
    marginBottom: 20,
  },
}));

const Component = ({ account, passphrase, rpc }) => {
  const classes = useStyles();
  const [messageSignature, setMessageSignature] = React.useState(null);

  const onSubmit = async e => {
    e.preventDefault();

    setMessageSignature(null);

    const message = (e.target.message.value ?? '').trim();

    const chainId = 6;
    const messageHex = stringToHex(message);

    setMessageSignature(
      await rpc('sign', messageHex, account, passphrase, numberToHex(chainId))
    );
  };

  return (
    <form {...{ onSubmit }} className="flex flex--column">
      <div className={classes.row}>
        <TextField
          id="message"
          label="Message"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={'Enter message...'}
          fullWidth
          multiline
          rows="2"
          required
        />
      </div>

      <div className={classes.row}>
        <Button type="submit" variant="contained" color="secondary">
          Sign
        </Button>
      </div>

      {!messageSignature ? null : (
        <Paper elevation={0} className={classes.messageSignature}>
          {messageSignature}
        </Paper>
      )}
    </form>
  );
};

export default connect(({ wallet: { account, passphrase } }, { match }) => {
  return { account, passphrase };
}, mapDispatchToProps)(Component);