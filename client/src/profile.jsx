import React, { useState } from 'react';
import { Card, CardContent, CardMedia, List, ListItem,
         ListItemIcon, ListItemText, Paper, Tabs, Tab } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { EmailRounded, FaceRounded, PersonRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

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
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const handleIndex = (index) => {
    setValue(index)
  }

  return (
    <div className="container">

      <Paper classes={{rounded: classes.paper}}>
        <Tabs value={value} onChange={handleChange} textColor="inherit" variant="fullWidth"
         classes={{root: classes.tabRoot, indicator: classes.tabIndicator }}>
          <Tab label="Profile" />
          <Tab label="Posts" />
          <Tab label="Saved" />
        </Tabs>
      </Paper>

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
                    <ListItemText primary="User Id" secondary={userId} />
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
          <Posts />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Saved />
        </TabPanel>

      </SwipeableViews>

    </div>
  )
}

function Posts(props) {
  return (
    <div className="my-5 mx-3">
      Hello
    </div>
  )
}

function Saved(props) {
  return (
    <div className="my-5 mx-3">
      To be added...
    </div>
  )
}
