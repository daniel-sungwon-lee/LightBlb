import React, { useEffect, useState } from 'react';
import { Card, CardContent, List, ListItem, ListItemAvatar,
         Avatar, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FaceRounded } from '@material-ui/icons';
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
