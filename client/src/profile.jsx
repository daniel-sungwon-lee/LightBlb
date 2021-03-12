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
    color: "white"
  },
  tabIndicator: {
    backgroundColor: "#8EE26B"
  }
})

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
        <Tabs value={value} onChange={handleChange} textColor="inherit" centered
         classes={{root: classes.tabRoot, indicator: classes.tabIndicator }}>
          <Tab label="Profile" />
          <Tab label="Posts" />
          <Tab label="Saved" />
        </Tabs>
      </Paper>
      <div className="my-5 mx-3">
        <Card>
          <CardMedia children={<FaceRounded className={classes.avatarPlaceholder} />}
           title="Avatar" />
          <CardContent classes={{root: classes.cardContentRoot}}>
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
    </div>
  )
}
