import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, List, ListItem, Paper, Tabs, Tab, Avatar,
         ListItemIcon, ListItemText, ListItemAvatar, Slide, IconButton, Menu,
         MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
         TextField } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { DeleteRounded, EditRounded, EmailRounded, FaceRounded, MoreVertRounded,
         PersonRounded, DoneRounded, BlockRounded } from '@material-ui/icons';
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
            <Posts userId={userId} />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Saved />
          </TabPanel>

        </SwipeableViews>
      </Slide>

    </div>
  )
}

function Posts(props) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [openDel, setOpenDel] = useState(false);

  useEffect(() => {
    setLoading(true)

    fetch(`/api/posts/${props.userId}`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(() => window.location.reload())
  }, [props.userId])

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
    <div className="my-5 mx-3">
      <Card classes={{root: classes.cardRoot}}>
        <CardContent>
          <List>
            {
              data.map(post => {
                const { content, postId, userId } = post

                return (
                  <ListItem key={postId} alignItems="flex-start" className={classes.listItemCard}>

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

                            <MenuItem onClick={() => setOpenDel(true)}>
                              <div className="p-2">
                                <EditRounded fontSize="large" />
                              </div>
                            </MenuItem>
                            <EditPost setLoading={setLoading} open={openDel} setOpen={setOpenDel}
                             userId={userId} postId={postId} />

                            <MenuItem>
                              <div className="p-2">
                                <DeleteRounded color="secondary" fontSize="large" />
                              </div>
                            </MenuItem>

                          </Menu>
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
  }, [props.postId, props.userId])

  const handleChange = (event) => {
    const { value } = event.target
    setContent(value)
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
      .then(() => props.setLoading(false))
      .catch(() => window.location.reload())
  }

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)} classes={{paper: classes.modalPaper}}
     TransitionComponent={Transition}>
      <div className="m-3">
        <DialogTitle>
          <h2>Edit Post</h2>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField multiline id="content" rows={5} variant="filled" label="Edit post"
              color="secondary" fullWidth spellCheck required InputLabelProps={{ required: false }} value={content} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <IconButton onClick={() => props.setOpen(false)}>
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


function Saved(props) {
  const classes = useStyles()

  return (
    <div className="my-5 mx-3">
      <Card classes={{root: classes.cardRoot}}>

      </Card>
    </div>
  )
}
