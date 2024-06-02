/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import MailIcon from '@mui/icons-material/Mail';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import { Badge } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { UserContext } from "api/LocalStorage";
import { getNoticeCount } from "api/axiosGet";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useWebSocket } from "api/webSocketContext";

function SidenavCollapse({ icon, name, active, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const [alertCount, setAlertCount] = useState(0);
  const { activeUser } = useContext(UserContext);
  const { stompClient, isConnect } = useWebSocket();
  
  useEffect(() => {
    let noticeincrease;
    let noticereset;

    if (name === '알림' && activeUser.uid != -1)
    {
      const getCount = async () => {
        const count = await getNoticeCount(activeUser.uid);
        setAlertCount(count);
      }
      getCount();
      
      if (stompClient && isConnect)
      {
        noticeincrease = stompClient.subscribe(`/user/notice/` + activeUser.uid, (data) => {
          setAlertCount(prevCount => prevCount + 1);
        });
        noticereset = stompClient.subscribe(`/user/noticeAll/` + activeUser.uid, (data) => {
          setAlertCount(0);
        });
        console.log('Subscribed to notice');
      }
    }
    else if (name === '알림' && activeUser.uid === -1)
    {
      console.log(stompClient);
      console.log(noticeincrease);
      console.log(noticereset);
      setAlertCount(0);
    }

    return () => {
      if (noticeincrease) {
        noticeincrease.unsubscribe();
      }
      if (noticereset) {
        noticereset.unsubscribe();
        console.log('Unsubscribed to notice');
      }
    };
  }, [activeUser.uid, stompClient, isConnect]);

  return (
    <ListItem component="li">
      <MDBox
        {...rest}
        sx={(theme) =>
          collapseItem(theme, {
            active,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            sidenavColor,
          })
        }
      >
        <ListItemIcon
          sx={(theme) =>
            collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
          }
        >
          {typeof icon === "string" ? (
            <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          ) : (
            name === '알림' ? (
              <Badge badgeContent={alertCount} color="primary">
                {icon}
              </Badge>
            ) : (
              icon
            )
          )}
        </ListItemIcon>

        <ListItemText
          primary={name}
          sx={(theme) =>
            collapseText(theme, {
              miniSidenav,
              transparentSidenav,
              whiteSidenav,
              active,
            })
          }
        />
      </MDBox>
    </ListItem>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default SidenavCollapse;
