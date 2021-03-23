import React, { useEffect, useState } from 'react';
import { Card, CardContent, List, ListItem, ListItemAvatar, Checkbox,
         Avatar, ListItemText, ListItemSecondaryAction, Slide, IconButton,
         Collapse, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FaceRounded, SaveRounded, SaveOutlined, InsertCommentRounded,
         AddCommentRounded } from '@material-ui/icons';
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

                      <IconButton onClick={handleExpand(postId)}>
                        <InsertCommentRounded className={classes.saveIcon} style={{color: "#694D33"}} />
                      </IconButton>

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
  const [comment, setComment] = useState('')

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
      .then(() => setProgress("invisible"))
      .catch(() => window.location.reload())
  }

  return (
    <CardContent>

      <form onSubmit={handleSubmit}>
        <TextField label="Add a comment" variant="filled" color="secondary" required
         InputLabelProps={{required: false}} onChange={handleChange} value={comment} />

        <IconButton type="submit">
          <AddCommentRounded fontSize="large" className={classes.checked} />
        </IconButton>
      </form>

    </CardContent>
  )
}
