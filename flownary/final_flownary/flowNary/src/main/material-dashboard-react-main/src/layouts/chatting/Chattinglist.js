import { ListItem, List, ListItemAvatar, Avatar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from 'api/LocalStorage';
import { getChatList } from 'api/axiosGet';
import { useWebSocket } from 'api/webSocketContext';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatList() {
    const { activeUser } = useContext(UserContext);
    const [list, setList] = useState([]);
    const { stompClient } = useWebSocket();
    const [count, setCount] = useState(20);
    const navigate = useNavigate();

    useEffect(() => {
        if (activeUser.uid !== -1) {
            const fetchChatList = async () => {
                const chatlist = await getChatList(activeUser.uid, count, 0);
                console.log(chatlist);
                setList(chatlist);
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
                        // console.log(list);
                        console.log(indexcid);
                        if (indexcid !== -1) {
                            const chat = prevList[indexcid];
                            const newlist = [{
                                cid: data.cid,
                                status: chat.status,
                                statusTime: chat.statusTime,
                                userCount: chat.userCount,
                                name: chat.name,
                                lastMessage: data.lastMessage,
                            }
                                , ...prevList.slice(0, indexcid), ...prevList.slice(indexcid + 1)];
                            console.log(newlist);

                            return newlist;
                        }
                        return prevList;
                    })
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

    const handleChatClick = (cid) => {
        navigate("/chatting", { state: { cid: cid } });
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <List>
                {list && list.map((data, idx) => (
                    <ListItem key={idx} onClick={() => handleChatClick(data.cid)}>
                        <ListItemAvatar>
                            <Avatar
                                sx={{ bgcolor: 'red'[500] }}
                                aria-label="recipe"
                                src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/Cloudinary-React/dddyq4tkk7gorhfm3twm`}
                            />
                        </ListItemAvatar>
                        {/* {data.cid} <br /> */}
                        {data.name} <br />
                        {data.lastMessage} <br />
                        {formatDate(data.statusTime)} <br />
                    </ListItem>
                ))}
            </List>
        </DashboardLayout>
    )
}
