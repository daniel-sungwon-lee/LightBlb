import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, List, ListItem, Paper, Tabs, Tab, Avatar,
         ListItemIcon, ListItemText, ListItemAvatar, Slide } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { EmailRounded, FaceRounded, PersonRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
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
                const { content, postId } = post

                return (
                  <ListItem key={postId} alignItems="flex-start" className={classes.listItemCard}>
                    <ListItemAvatar>
                      <Avatar classes={{colorDefault: classes.avatar}}>
                        <FaceRounded />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={content} secondary={`Post ID: ${postId}`} />
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

function Saved(props) {
  const classes = useStyles()

  return (
    <div className="my-5 mx-3">
      <Card classes={{root: classes.cardRoot}}>

      </Card>
    </div>
  )
}
