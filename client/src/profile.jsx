import React from 'react';
import { Card, CardContent, CardMedia, List, ListItem,
         ListItemIcon, ListItemText } from '@material-ui/core';
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
  }
})

export default function Profile(props) {
  const { email, userId } = props.user
  const classes = useStyles()

  return (
    <div className="container">
      <h1>Profile</h1>
      <div className="my-5 mx-3">
        <Card>
          <CardMedia children={<FaceRounded className={classes.avatarPlaceholder} />}
           title="Avatar" />
          <CardContent classes={{root: classes.cardContentRoot}}>
            <List>

              <ListItem>
                <ListItemIcon>
                  <EmailRounded className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={email} />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <PersonRounded className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="User Id" secondary={userId} />
              </ListItem>

            </List>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
