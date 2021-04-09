import React, { useState } from 'react';
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
    color: "#8EE26B"
  },
  iconSecondary: {
    fontSize: "3rem"
  }
})

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function Post(props) {
  const classes = useStyles();
  const [content, setContent] = useState('');

  const handleChange = (event) => {
    const { value } = event.target
    setContent(value)
  }

  const handleSubmit = (event) => {
    props.setLoading(true)
    event.preventDefault()

    const { userId } = props.user
    const reqBody = { userId, content }

    fetch('/api/post', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    })
      .then(() => {
        // eslint-disable-next-line no-cond-assign
        if (window.location.pathname = "/profile") {
          window.location.pathname = "/"
        } else {
          props.setLoading(false)
        }
      })
      .catch(() => window.location.reload())
  }

  const handleCancel = () => {
    setContent('')
    props.setOpen(false)
  }

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)} TransitionComponent={Transition}
     classes={{paper: classes.paper}}>
      <div className="m-3">
        <DialogTitle>
          <h2>New Post</h2>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField multiline id="content" rows={5} variant="filled" label="What is your great startup idea?"
             color="secondary" fullWidth spellCheck required InputLabelProps={{required: false}} value={content} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <IconButton onClick={handleCancel}>
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
