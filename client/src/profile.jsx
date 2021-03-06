import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, List, ListItem, Paper, Tabs, Tab, Avatar,
         ListItemIcon, ListItemText, ListItemAvatar, Slide, IconButton, Menu,
         MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
         TextField, Collapse, ListItemSecondaryAction } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { DeleteRounded, EditRounded, EmailRounded, FaceRounded, MoreVertRounded, ArrowBackRounded,
         PersonRounded, DoneRounded, BlockRounded, DeleteForeverRounded, CommentRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Spinner from './components/spinner';

const useStyles = makeStyles({
  avatarPlaceholder: {
    fontSize: "15rem"
  },
  icon: {
    color: "#694D33"
  },
  cardContentRoot: {
    display: "flex",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: "#694D33"
  },
  tabRoot: {
    color: "white",
    margin: "0 23px"
  },
  tabIndicator: {
    backgroundColor: "#8EE26B"
  },
  cardRoot: {
    minHeight: "440px"
  },
  listItemCard: {
    margin: "2rem 0"
  },
  avatar: {
    color: "black",
    backgroundColor: "#FFEC29"
  },
  menu: {
    borderRadius: "3rem !important"
  },
  modalPaper: {
    width: "75%"
  },
  modalIcon: {
    fontSize: "3rem"
  },
  deletePaper: {
    padding: "2rem",
    width: "75%"
  }
})

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={index}
    >
      {value === index && (
        <>
          {children}
        </>
      )}
    </div>
  );
}

//main page (profile tab)
export default function Profile(props) {
  const { email, userId } = props.user;
  const classes = useStyles();
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState(0);

  useEffect(() => {

    setLoading(false)

  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const handleIndex = (index) => {
    setValue(index)
  }

  if(loading) {
    return <Spinner />
  }

  return (
    <div className="container">

      <Slide in direction="down" timeout={500}>
        <Paper classes={{rounded: classes.paper}}>
          <Tabs value={value} onChange={handleChange} textColor="inherit" variant="fullWidth"
          classes={{root: classes.tabRoot, indicator: classes.tabIndicator }}>
            <Tab label="Profile" />
            <Tab label="Posts" />
            <Tab label="Saved" />
          </Tabs>
        </Paper>
      </Slide>

      <Slide in direction="left" timeout={500}>
        <SwipeableViews index={value} onChangeIndex={handleIndex}>

          <TabPanel value={value} index={0}>
            <div className="my-5 mx-3">
              <Card>
                <CardMedia children={<FaceRounded className={classes.avatarPlaceholder} />}
                  title="Avatar" />
                <CardContent classes={{ root: classes.cardContentRoot }}>
                  <List>

                    <ListItem>
                      <ListItemIcon>
                        <PersonRounded className={classes.icon} />
                      </ListItemIcon>
                      <ListItemText primary="User ID" secondary={userId} />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <EmailRounded className={classes.icon} />
                      </ListItemIcon>
                      <ListItemText primary="Email" secondary={email} />
                    </ListItem>

                  </List>
                </CardContent>
              </Card>
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Posts userId={userId} setLoading={setLoading} setValue={setValue}
             setProgress={props.setProgress} />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Saved userId={userId} setLoading={setLoading} setValue={setValue} />
          </TabPanel>

        </SwipeableViews>
      </Slide>

    </div>
  )
}

//posts tab
function Posts(props) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [openEdit, setOpenEdit] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [empty, setEmpty] = useState('spinner')
  const [expand, setExpand] = useState([])

  useEffect(() => {
    setLoading(true)

    fetch(`/api/posts/${props.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setEmpty("d-none")
        }
        setData(data)
        setLoading(false)
      })
      .catch(() => window.location.reload())
  }, [props.userId])

  const handleComment = (popupState, postId) => () => {
    handleExpand(postId)
    popupState.close()
  }

  const handleExpand = (postId) => {
    if (expand.includes(postId)) {
      const updatedExpand = expand.filter(id => id !== postId)
      setExpand(updatedExpand)

    } else {
      setExpand([...expand, postId])
    }
  }

  if(loading) {
    return (
      <div className="my-5 mx-3 position-relative">
        <Card classes={{root: classes.cardRoot}}>
          <Spinner />
        </Card>
      </div>
    )
  }

  return (
    <div className="my-5 mx-3 position-relative">
      <h2 className={empty} style={{opacity: 0.3}}>No Posts...</h2>
      <Card classes={{root: classes.cardRoot}}>
        <CardContent>
          <List>
            {
              data.map(post => {
                const { content, postId, userId } = post

                return (
                  <ListItem key={postId} alignItems="flex-start" className={classes.listItemCard}
                   style={{flexDirection: "column"}}>

                    <div className="w-100 d-flex justify-content-between align-items-start">
                      <ListItemAvatar>
                        <Avatar classes={{colorDefault: classes.avatar}}>
                          <FaceRounded />
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText primary={content} secondary={`Post ID: ${postId}`} />

                      <PopupState id="menu" variant="popover">
                        {
                          popupState => (
                            <>
                            <IconButton {...bindTrigger(popupState)}>
                              <MoreVertRounded fontSize="large" />
                            </IconButton>

                            <Menu classes={{paper: classes.menu}} {...bindMenu(popupState)}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                              getContentAnchorEl={null}
                              >

                              <MenuItem onClick={() => setOpenEdit(true)}>
                                <div className="p-2">
                                  <EditRounded fontSize="large" />
                                </div>
                              </MenuItem>
                              <EditPost setLoading={props.setLoading} open={openEdit} setOpen={setOpenEdit}
                              userId={userId} postId={postId} popupState={popupState} setValue={props.setValue} />

                              <MenuItem onClick={() => setOpenDel(true)}>
                                <div className="p-2">
                                  <DeleteRounded color="secondary" fontSize="large" />
                                </div>
                              </MenuItem>
                              <DeletePost open={openDel} setOpen={setOpenDel} userId={userId} postId={postId}
                              setLoading={props.setLoading} popupState={popupState} setValue={props.setValue} />

                              <MenuItem onClick={handleComment(popupState, postId)}>
                                <div className="p-2">
                                  <CommentRounded fontSize="large" />
                                </div>
                              </MenuItem>

                            </Menu>
                            </>
                          )
                        }
                      </PopupState>
                    </div>

                    <Collapse in={expand.includes(postId)} timeout="auto" className="w-100">
                      <Comment postId={postId} setProgress={props.setProgress} userId={props.userId} />
                    </Collapse>

                  </ListItem>
                )
              })
            }
          </List>
        </CardContent>
      </Card>
    </div>
  )
}

//edit post modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

function EditPost(props) {
  const classes = useStyles();
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`/api/posts/${props.userId}/${props.postId}`)
     .then(res => res.json())
     .then(data => {
       const { content } = data
       setContent(content)
     })
     .catch(() => window.location.reload())
  }, [props.postId, props.userId])

  const handleChange = (event) => {
    const { value } = event.target
    setContent(value)
  }

  const handleClose = () => {
    props.setOpen(false)
    props.popupState.close()
  }

  const handleSubmit = (event) => {
    props.setLoading(true)
    event.preventDefault()

    const reqBody = { content }

    fetch(`/api/posts/${props.userId}/${props.postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody)
    })
      .then(() => {
        props.setValue(1)
        props.setLoading(false)
      })
      .catch(() => window.location.reload())
  }

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)} classes={{paper: classes.modalPaper}}
     TransitionComponent={Transition} onBackdropClick={props.popupState.close}>
      <div className="m-3">
        <DialogTitle>
          <h2>Edit Post</h2>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField multiline id="content" rows={5} variant="filled" label="Edit your post"
              color="secondary" fullWidth spellCheck required InputLabelProps={{ required: false }} value={content} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <IconButton onClick={handleClose}>
              <BlockRounded color="secondary" className={classes.modalIcon} />
            </IconButton>
            <IconButton type="submit">
              <DoneRounded style={{color: "#8EE26B"}} className={classes.modalIcon} />
            </IconButton>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  )
}

//delete post modal
const Transition2 = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function DeletePost(props) {
  const classes = useStyles();

  const handleClose = () => {
    props.setOpen(false)
    props.popupState.close()
  }

  const handleDelete = () => {
    props.setLoading(true)

    fetch(`/api/saved/${props.postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(() => {

        fetch(`/api/comments/${props.postId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        })
          .then(() => {

            fetch(`/api/posts/${props.userId}/${props.postId}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" }
            })
              .then(() => {

                props.setValue(1)
                props.setLoading(false)
              })
              .catch(() => window.location.reload())
          })
          .catch(() => window.location.reload())
      })
      .catch(() => window.location.reload())
  }

  return (
    <Dialog classes={{ paper: classes.deletePaper }} onClose={() => props.setOpen(false)}
      open={props.open} TransitionComponent={Transition2} onBackdropClick={props.popupState.close}>
      <DialogTitle>
        <h2>Delete Post?</h2>
      </DialogTitle>
      <DialogActions>
        <IconButton onClick={handleClose}>
          <ArrowBackRounded style={{ color: "#8EE26B" }} className={classes.modalIcon} />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteForeverRounded color="secondary" className={classes.modalIcon} />
        </IconButton>
      </DialogActions>
    </Dialog>
  )
}

//saved tab
function Saved(props) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [empty, setEmpty] = useState("spinner")

  useEffect(() => {
    setLoading(true)

    fetch(`/api/profile/saved/${props.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setEmpty("d-none")
        }
        setData(data)
        setLoading(false)
      })
  }, [props.userId])

  if (loading) {
    return (
      <div className="my-5 mx-3 position-relative">
        <Card classes={{ root: classes.cardRoot }}>
          <Spinner />
        </Card>
      </div>
    )
  }

  return (
    <div className="my-5 mx-3 position-relative">
      <h2 className={empty} style={{ opacity: 0.3 }}>None Saved...</h2>
      <Card classes={{root: classes.cardRoot}}>
        <CardContent>
          <List>
            {
              data.map(saved => {
                const { postId, content, userId } = saved

                return (
                  <ListItem key={postId} alignItems="flex-start" className={classes.listItemCard}>

                    <ListItemAvatar>
                      <Avatar classes={{ colorDefault: classes.avatar }}>
                        <FaceRounded />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText primary={content} secondary={`User ID: ${userId}`} />

                    <PopupState id="delete" variant="popover">
                      {
                        popupState2 => (
                          <>
                          <IconButton onClick={() => setOpen(true)} {...bindTrigger(popupState2)}>
                            <DeleteRounded fontSize="large" color="secondary" />
                          </IconButton>

                          <DeleteSavedPost open={open} setOpen={setOpen} postId={postId} userId={props.userId}
                           setLoading={props.setLoading} setValue={props.setValue} {...bindMenu(popupState2)}
                           popupState2={popupState2} />
                          </>
                        )
                      }
                    </PopupState>

                  </ListItem>
                )
              })
            }
          </List>
        </CardContent>
      </Card>
    </div>
  )
}

//delete saved post modal
function DeleteSavedPost(props) {
  const classes = useStyles();

  const handleClose = () => {
    props.setOpen(false)
    props.popupState2.close()
  }

  const handleDelete = () => {
    props.setLoading(true)

    fetch(`/api/saved/${props.postId}/${props.userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(() => {
        props.setValue(2)
        props.setLoading(false)
      })
      .catch(() => window.location.reload())
  }

  return (
    <Dialog classes={{ paper: classes.deletePaper }} onClose={() => props.setOpen(false)}
      open={props.open} TransitionComponent={Transition2} onBackdropClick={props.popupState2.close}>
      <DialogTitle>
        <h2>Remove Saved Post?</h2>
      </DialogTitle>
      <DialogActions>
        <IconButton onClick={handleClose}>
          <ArrowBackRounded style={{ color: "#8EE26B" }} className={classes.modalIcon} />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteForeverRounded color="secondary" className={classes.modalIcon} />
        </IconButton>
      </DialogActions>
    </Dialog>
  )
}

//comment section
function Comment(props) {
  const { postId, setProgress } = props
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [empty, setEmpty] = useState('spinner')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLoading(true)

    fetch(`/api/comments/${postId}`)
      .then(res => res.json())
      .then(comments => {
        if(comments.length > 0) {
          setEmpty("d-none")
        }
        setComments(comments)
        setLoading(false)
      })
      .catch(() => window.location.reload())
  },[postId])

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

  if(loading) {
    return (
      <div className="position-relative" style={{minHeight: "160px"}}>
        <Spinner />
      </div>
    )
  }

  return (
    <List className="position-relative">
      <h6 className={empty} style={{opacity: 0.3}}>No Comments...</h6>
      {
        comments.map(comm => {
          const { comment, commentId, userId } = comm

          return (
            <ListItem key={commentId}>

              <ListItemText primary={comment} secondary={`User ID: ${userId}`} />

              {
                props.userId === userId
                  ? <ListItemSecondaryAction>

                      <PopupState id="comment-delete" variant="popover">
                        {
                          popupState3 => (
                            <>
                              <IconButton onClick={() => setOpen(true)} {...bindTrigger(popupState3)}>
                                <DeleteRounded color="secondary" />
                              </IconButton>

                              <DeleteComment commentId={commentId} handleDelete={handleDelete} open={open}
                                setOpen={setOpen} {...bindMenu(popupState3)} popupState={popupState3} />
                            </>
                          )
                        }
                      </PopupState>

                    </ListItemSecondaryAction>
                  : <></>
              }

            </ListItem>
          )
        })
      }
    </List>
  )
}

//delete comment modal
function DeleteComment(props) {
  const { commentId, handleDelete, open, setOpen, popupState } = props
  const classes = useStyles()

  const handleClose = () => {
    setOpen(false)
    popupState.close()
  }

  return (
    <Dialog classes={{ paper: classes.deletePaper }} onClose={() => setOpen(false)}
      open={open} TransitionComponent={Transition2} onBackdropClick={popupState.close}>
      <DialogTitle>
        <h2>Delete Comment?</h2>
      </DialogTitle>
      <DialogActions>
        <IconButton onClick={handleClose}>
          <ArrowBackRounded style={{ color: "#8EE26B" }} className={classes.modalIcon} />
        </IconButton>
        <IconButton onClick={handleDelete(commentId)}>
          <DeleteForeverRounded color="secondary" className={classes.modalIcon} />
        </IconButton>
      </DialogActions>
    </Dialog>
  )
}
