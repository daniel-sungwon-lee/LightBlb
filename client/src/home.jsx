import React, { useEffect, useState } from 'react';
import { Card, CardContent, List, ListItem, ListItemAvatar, Checkbox,
         Avatar, ListItemText, ListItemSecondaryAction, Slide, IconButton,
         Collapse, TextField, Dialog, DialogTitle, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FaceRounded, SaveRounded, SaveOutlined, InsertCommentRounded, ArrowBackRounded,
         AddCommentRounded, ExpandLessRounded, DeleteRounded, DeleteForeverRounded } from '@material-ui/icons';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Spinner from './components/spinner';

const useStyles = makeStyles({
  card : {
    margin: "2rem 1rem"
  },
  avatar: {
    color: "black",
    backgroundColor: "#FFEC29",
    width: "70px",
    height: "70px"
  },
  avatarIcon: {
    fontSize: "3rem"
  },
  saveIcon: {
    fontSize: "2rem"
  },
  unchecked: {
    color: "#694D33"
  },
  checked: {
    color: "#8EE26B"
  },
  deletePaper: {
    padding: "2rem",
    width: "75%"
  }
})

export default function Home(props) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [saved, setSaved] = useState([])
  const [expand, setExpand] = useState([])

  useEffect(() => {
    const { userId } = props.user

    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setData(data)

        fetch(`/api/saved/${userId}`)
          .then(res => res.json())
          .then(data => {
            setSaved(data)
            setLoading(false)
          })
          .catch(() => window.location.reload())
      })
      .catch(() => window.location.reload())
  }, [props.user, saved])

  const handleChange = (event) => {
    props.setProgress('')

    const postId = event.target.id
    const userId = props.user.userId
    const reqBody = { postId, userId }

    if(event.target.checked) {

      fetch(`/api/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody)
      })
        .then(() => props.setProgress("invisible"))
        .catch(() => window.location.reload())

    } else {

      fetch(`/api/saved/${postId}/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
        .then(() => props.setProgress("invisible"))
        .catch(() => window.location.reload())
    }
  }

  const handleExpand = (postId) => () => {
    if (expand.includes(postId)) {
      const updatedExpand = expand.filter(id => id !== postId)
      setExpand(updatedExpand)

    } else {
      setExpand([...expand, postId])
    }
  }

  if(loading) {
    return <Spinner />
  }

  return (
    <div className="container">
      <Slide in>
        <h1>Home</h1>
      </Slide>
      <List>
        {
          data.map(post => {
            const { postId, userId, content } = post

            return (
              <Slide in timeout={500} key={postId}>
                <Card key={postId} className={classes.card}>

                  <ListItem>
                    <CardContent style={{ width: "85%" }}>

                      <ListItemAvatar>
                        <Avatar classes={{colorDefault: classes.avatar}}>
                          <FaceRounded className={classes.avatarIcon} />
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText className="text-break" primary={content} secondary={`User ID: ${userId}`} />

                      <Checkbox onChange={handleExpand(postId)} checkedIcon={<ExpandLessRounded className={classes.saveIcon} color="secondary" />}
                       color="default" icon={<InsertCommentRounded className={classes.saveIcon} style={{color: "#694D33"}} />} />

                      <Collapse in={expand.includes(postId)} timeout="auto">

                        <Comment postId={postId} userId={props.user.userId} setProgress={props.setProgress} />

                      </Collapse>

                      <ListItemSecondaryAction>

                        <Checkbox checkedIcon={<SaveRounded className={classes.saveIcon} />}
                         icon={<SaveOutlined className={classes.saveIcon} />} color="default"
                         id={postId.toString()} onChange={handleChange} classes={{
                             checked: classes.checked, root: classes.unchecked
                           }} checked={saved.some(s => s.postId === postId)} />

                      </ListItemSecondaryAction>

                    </CardContent>
                  </ListItem>

                </Card>
              </Slide>
            )
          })
        }
      </List>
    </div>
  )
}

//comment section
function Comment(props) {
  const { postId, userId, setProgress } = props
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLoading(true)

    fetch(`/api/comments/${postId}`)
      .then(res => res.json())
      .then(comments => {
        setComments(comments)
        setLoading(false)
      })
      .catch(() => window.location.reload())
  }, [postId])

  const handleChange = (event) => {
    const { value } = event.target
    setComment(value)
  }

  const handleSubmit = (event) => {
    setProgress('')
    event.preventDefault()

    const reqBody = { postId, userId, comment }

    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    })
      .then(() => {
        setComment('')

        fetch(`/api/comments/${postId}`)
          .then(res => res.json())
          .then(comments => {
            setComments(comments)
            setProgress("invisible")
          })
          .catch(() => window.location.reload())
      })
      .catch(() => window.location.reload())
  }

  const handleDelete = (commentId) => () => {
    setProgress('')

    fetch(`/api/comment/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(() => {

        fetch(`/api/comments/${postId}`)
          .then(res => res.json())
          .then(comments => {
            setComments(comments)
            setProgress("invisible")
          })
          .catch(() => window.location.reload())
      })
      .catch(() => window.location.reload())
  }

  if (loading) {
    return (
      <CardContent className="position-relative">
        <Spinner />
      </CardContent>
    )
  }

  return (
    <CardContent>
      <List>
        {
          comments.map(comm => {
            const { comment, commentId, userId } = comm

            return (
              <ListItem key={commentId}>

                <ListItemText className="text-break mr-3" primary={comment} secondary={`User ID: ${userId}`} />

                <ListItemSecondaryAction>

                  <PopupState id="comment-delete" variant="popover">
                    {
                      popupState => (
                        <>
                          <IconButton onClick={() => setOpen(true)} {...bindTrigger(popupState)}>
                            <DeleteRounded color="secondary" />
                          </IconButton>

                          <DeleteComment commentId={commentId} handleDelete={handleDelete} open={open}
                           setOpen={setOpen} {...bindMenu(popupState)} popupState={popupState} />
                        </>
                      )
                    }
                  </PopupState>

                </ListItemSecondaryAction>

              </ListItem>
            )
          })
        }
      </List>

      <form onSubmit={handleSubmit}>
        <TextField label="Add a comment..." variant="filled" color="secondary" required
         InputLabelProps={{required: false}} onChange={handleChange} value={comment} multiline />

        <IconButton type="submit">
          <AddCommentRounded fontSize="large" className={classes.checked} />
        </IconButton>
      </form>

    </CardContent>
  )
}

//delete comment modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function DeleteComment(props) {
  const { commentId, handleDelete, open, setOpen, popupState } = props
  const classes = useStyles()

  const handleClose = () => {
    setOpen(false)
    popupState.close()
  }

  return (
    <Dialog classes={{ paper: classes.deletePaper }} onClose={() => setOpen(false)}
     open={open} TransitionComponent={Transition} onBackdropClick={popupState.close}>
      <DialogTitle>
        <h2>Delete Comment?</h2>
      </DialogTitle>
      <DialogActions>
        <IconButton onClick={handleClose}>
          <ArrowBackRounded style={{ color: "#8EE26B" }} className={classes.avatarIcon} />
        </IconButton>
        <IconButton onClick={handleDelete(commentId)}>
          <DeleteForeverRounded color="secondary" className={classes.avatarIcon} />
        </IconButton>
      </DialogActions>
    </Dialog>
  )
}
