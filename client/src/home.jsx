import React, { useEffect, useState } from 'react';
import { Card, CardContent, List, ListItem, ListItemAvatar, Checkbox,
         Avatar, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FaceRounded, SaveRounded, SaveOutlined } from '@material-ui/icons';
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

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  const handleChange = (event) => {
    const postId = event.target.id
    const userId = props.user.userId
    const reqBody = { postId, userId }

    if(event.target.checked) {
      fetch(`/api/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody)
      })
        .catch(() => window.location.reload())

    } else {
      fetch(`/api/saved/${postId}/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
        .catch(() => window.location.reload())
    }
  }

  if(loading) {
    return <Spinner />
  }

  return (
    <div className="container">
      <h1>Home</h1>
      <List>
        {
          data.map(post => {
            const { postId, userId, content } = post

            return (
              <Card key={postId} className={classes.card}>

                <ListItem>
                  <CardContent>

                    <ListItemAvatar>
                      <Avatar classes={{colorDefault: classes.avatar}}>
                        <FaceRounded className={classes.avatarIcon} />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText primary={content} secondary={`User ID: ${userId}`} />

                    <ListItemSecondaryAction>
                      <Checkbox checkedIcon={<SaveRounded className={classes.saveIcon} />}
                      icon={<SaveOutlined className={classes.saveIcon} />}
                      id={postId.toString()} onChange={handleChange} classes={{
                        checked: classes.checked, root: classes.unchecked
                        }} color="default" />
                    </ListItemSecondaryAction>

                  </CardContent>
                </ListItem>

              </Card>
            )
          })
        }
      </List>
    </div>
  )
}
