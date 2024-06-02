import React, { useState, useRef, useEffect, useContext } from 'react';
import { Avatar, Box, Stack, TextField, InputAdornment, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EastIcon from '@mui/icons-material/East';
import { GetWithExpiry } from 'api/LocalStorage';
import './components/chat.css';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { UserContext } from 'api/LocalStorage';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWebSocket } from 'api/webSocketContext';
import { getDmList } from 'api/axiosGet';
import { getChat } from 'api/axiosGet';
import { getUserNickEmail } from 'api/axiosGet';
import { insertChat } from 'api/axiosPost';

export default function ChatTemp() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageEndRef = useRef(null);
    const inputFieldHeight = 65; // 입력 필드의 높이를 고정값
    const { activeUser } = useContext(UserContext);
    const { state } = useLocation() || {};
    const { uid1, uid2 } = state;
    const { stompClient } = useWebSocket();
    const [count, setCount] = useState(20);
    const [list, setList] = useState([]);
    const [chatroom, setChatroom] = useState(null);
    const profile = GetWithExpiry("profile");

    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    useEffect(() => {
        const user2 = getUserNickEmail(uid2);
        setUser(user2);
        setName(user2.nickname + ' 채팅방');
    }, [])

    const handleMessageSend = () => {
        if (inputMessage.trim() !== '' && stompClient && stompClient.connected) {
            const cid = insertChat(name, uid1, uid2, inputMessage );

            setInputMessage('');
            if (cid >= 0) {
                navigate("/chatting", {state: {cid: cid}});
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleMessageSend();
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box
                sx={{
                    top: '10%',
                    margin: '20px',
                    padding: '20px',
                    minHeight: '400px',
                    height: 'calc(100vh - 200px)',
                    width: '80%',
                    mx: 'auto',
                    overflowY: 'auto',
                }}
            >
                <Stack sx={{ fontSize: 'xx-large', fontWeight: 'bold', mx: 'auto' }}>
                    <div style={{ color: 'rgb(88, 67, 135)' }}>
                        <Avatar alt="User" src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${profile}`} />
                        {activeUser.email}
                        <Typography>{name}와의 채팅방</Typography>
                        <hr style={{ opacity: '0.4', marginTop: 20 }} />
                    </div>
                </Stack>
                {/* maxHeight를 사용 스크롤 활성 */}
                <Stack sx={{ maxHeight: `calc(100vh - ${inputFieldHeight + 385}px)`, overflowY: 'auto', flexDirection: 'column-reverse' }}> {/* 메시지 영역의 최대 높이를 조정 */}
                    <br />
                </Stack>
                <Stack
                    sx={{
                        // position: 'fixed',
                        // bottom: '5px',
                        width: '100%',
                    }}
                >
                    <TextField
                        sx={{
                            marginBottom: '1.5em',
                            height: `${inputFieldHeight}px`, // 입력 필드의 높이 설정
                        }}
                        fullWidth
                        placeholder="메시지를 입력하세요..."
                        variant="outlined"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" >
                                    <IconButton onClick={handleMessageSend}>
                                        <EastIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
            </Box>
        </DashboardLayout>
    );
}