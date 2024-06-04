import { ListItem, List, ListItemAvatar, Avatar, ListItemText, Typography, Badge, Box, Divider, Paper, Grid, Stack, IconButton, Icon } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from 'api/LocalStorage';
import { getChatList } from 'api/axiosGet';
import { useWebSocket } from 'api/webSocketContext';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ChattingIndex from './ChattingIndex';
import TimeAgo from 'timeago-react';

export default function ChatList() {
  const { activeUser } = useContext(UserContext);
  const [list, setList] = useState([]);
  const { stompClient } = useWebSocket();
  const [count, setCount] = useState(20);
  const navigate = useNavigate();
  const [cid, setCid] = useState(0);

  useEffect(() => {
    if (activeUser.uid !== -1) {
      const fetchChatList = async () => {
        const chatlist = await getChatList(activeUser.uid, count, 0);
        if (chatlist) {
          setList(chatlist);
          setCid(chatlist[0].cid) // Assuming the correct structure is chatlist[0].cid
        } else {
          console.error("Chat list is empty or not available");
        }
      }

      fetchChatList();
      let chatrefresh;

      if (stompClient && stompClient.connected) {
        console.log('chat websocket connected');
        stompClient.publish({
          destination: '/app/page',
          body: JSON.stringify({ userId: activeUser.uid, page: 'chat', action: 'enter' }),
        });

        chatrefresh = stompClient.subscribe(`/topic/chatlist`, (message) => {
          const data = JSON.parse(message.body);
          console.log(data);

          setList(prevList => {
            const indexcid = prevList.findIndex(item => item.cid === data.cid);
            if (indexcid !== -1) {
              const chat = prevList[indexcid];
              const newlist = [{
                cid: data.cid,
                status: chat.status,
                statusTime: chat.statusTime,
                userCount: chat.userCount,
                name: chat.name,
                lastMessage: data.lastMessage,
              }, ...prevList.slice(0, indexcid), ...prevList.slice(indexcid + 1)];
              return newlist;
            }
            return prevList;
          });
        });
      }

      return () => {
        if (stompClient && stompClient.connected) {
          stompClient.publish({
            destination: '/app/page',
            body: JSON.stringify({ userId: activeUser.uid, page: 'chat', action: 'leave' }),
          });
          console.log('chat websocket disconnected');
        }

        if (chatrefresh) {
          chatrefresh.unsubscribe();
        }
      }
    }
  }, [activeUser.uid, count, stompClient]);

  const handleChatClick = async (cid) => {
    await setCid(cid);
    navigate("/chatlist", { state: { cid: cid } });
  }

  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            elevation={3}
            sx={{
              maxWidth: 1200,
              width: '100%',
              background: '#fff',
              borderRadius: 4,
              overflow: 'hidden',
              px: 3,
            }}
          >
            <List sx={{ cursor: 'pointer' }}>
              {cid ? (list && list.map((data, idx) => (idx < 3 &&
                <React.Fragment key={idx}>
                  <ListItem
                    onClick={() => handleChatClick(data.cid)}
                    sx={{
                      borderRadius: 2,
                      transition: '0.3s',
                      '&:hover': {
                        backgroundColor: '#e1e8ed',
                        transform: 'scale(1.02)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <div
                            style={{
                              width: '1rem',
                              height: '1rem',
                              borderRadius: '50%',
                              backgroundColor: 'lightcoral',
                              border: '2px solid white',
                            }}
                          ></div>
                        }
                      >
                        <Avatar
                          sx={{ width: 25, height: 25 }}
                          src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${activeUser.profile}`}
                        />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>{data.name}</Typography>}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {data.lastMessage}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            <TimeAgo datetime={data.statusTime} locale="ko" />
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {idx < list.length - 1 && <Divider variant="middle" sx={{ m: 0, p: 0 }} />}
                </React.Fragment>
              ))) : <Typography>채팅을 시작해보세요!</Typography>}
            </List>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
