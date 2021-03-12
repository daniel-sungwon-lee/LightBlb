import React from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, Slide,
         DialogActions, IconButton } from '@material-ui/core';
import { DoneRounded, BlockRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  paper: {
    width: "75%"
  },
  icon: {
    fontSize: "3rem",
    color: "#694D33"
  },
  iconSecondary: {
    fontSize: "3rem"
  }
})

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function Post(props) {
  const classes = useStyles()

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)} TransitionComponent={Transition}
     classes={{paper: classes.paper}}>
      <div className="m-3">
        <DialogTitle>
          <h2>New Post</h2>
        </DialogTitle>
        <form>
          <DialogContent>
            <TextField multiline id="content" rows={5} variant="filled" label="What is your great idea?"
            fullWidth spellCheck required InputLabelProps={{required: false}} />
          </DialogContent>
          <DialogActions>
            <IconButton onClick={() => props.setOpen(false)}>
              <BlockRounded className={classes.iconSecondary} color="secondary" />
            </IconButton>
            <IconButton type="submit">
              <DoneRounded className={classes.icon} />
            </IconButton>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  )
}
