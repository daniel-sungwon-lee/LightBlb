import React, { useState } from 'react';
import { AppBar, Button, Drawer, Icon, IconButton, List, ListItem, Toolbar,
         Tooltip, Slide } from '@material-ui/core';
import { ExitToAppRounded, HomeRounded, MenuRounded, PersonRounded,
         PostAddRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    backgroundColor: "#FFEC29"
  },
  icon: {
    fontSize: "3rem",
    color: "#694D33"
  },
  iconRed: {
    fontSize: "3rem"
  },
  list: {
    width: "275px"
  },
  tooltip: {
    backgroundColor: "#F50057"
  },
  tooltipBrown: {
    backgroundColor: "#694D33"
  }
})

export default function Nav(props) {
  const classes = useStyles()
  const [open, setOpen] = useState({
    left: false
  })

  const toggle = (side, open) => () => {
    setOpen({ [side]: open })
  }

  return (
    <Slide direction="left" in>
      <div className="sticky-top mb-5">
        <AppBar position="sticky" classes={{root: classes.root}}>
          <Toolbar className="justify-content-between">

            <div className="d-flex align-items-center">
              <IconButton onClick={toggle("left", true)} style={{marginRight: "13px"}}>
                <MenuRounded className={classes.icon} />
              </IconButton>
              <a href="/" className="text-decoration-none">
                <div className="d-flex align-items-center">
                  <h3 className="m-0 text-dark">LightBlb</h3>
                  <img src="images/lightblb.svg" alt="LightBlb logo" width="40" />
                </div>
              </a>
            </div>

            <Drawer anchor={"left"} open={open["left"]} onClose={toggle("left", false)}>
              <div className={classes.list}>
                <List className="mt-3">

                  <Link to="/" className="text-decoration-none">
                    <Button fullWidth className="p-0">
                      <ListItem className="d-flex justify-content-center py-3" onClick={toggle("left", false)}>
                        <h3 className="m-0">
                          <HomeRounded className={classes.icon} />
                        </h3>
                      </ListItem>
                    </Button>
                  </Link>

                  <Link to="/profile" className="text-decoration-none">
                    <Button fullWidth className="p-0">
                      <ListItem className="d-flex justify-content-center py-3" onClick={toggle("left", false)}>
                        <h3 className="m-0">
                          <PersonRounded className={classes.icon} />
                        </h3>
                      </ListItem>
                    </Button>
                  </Link>

                  <Link to="/auth" className="text-decoration-none">
                    <Tooltip title="Logout" classes={{tooltip: classes.tooltip}}>
                      <Button fullWidth className="p-0" color="secondary">
                        <ListItem className="d-flex justify-content-center py-3" onClick={props.handleSignOut}>
                          <h3 className="m-0" onClick={toggle("left", false)}>
                            <Icon color="secondary">
                              <ExitToAppRounded className={classes.iconRed} />
                            </Icon>
                          </h3>
                        </ListItem>
                      </Button>
                    </Tooltip>
                  </Link>

                </List>
              </div>
              <div className="nav-logo">
                <img src="images/lightblb.svg" width="80" alt="LightBlb logo" />
              </div>
            </Drawer>

            <Tooltip title="New Post" classes={{tooltip: classes.tooltipBrown}}>
              <IconButton>
                <PostAddRounded className={classes.icon} />
              </IconButton>
            </Tooltip>

          </Toolbar>
        </AppBar>
      </div>
    </Slide>
  )
}
