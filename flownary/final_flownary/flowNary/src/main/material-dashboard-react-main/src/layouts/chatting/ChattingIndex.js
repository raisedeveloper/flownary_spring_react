import React, { useState, useRef, useEffect, useContext } from 'react';
import { Avatar, Box, Stack, TextField, InputAdornment, Icon } from "@mui/material";
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
import TouchRipple from '@mui/material/ButtonBase/TouchRipple';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageEndRef = useRef(null);
    const inputFieldHeight = 65; // 입력 필드의 높이를 고정값
    const { activeUser } = useContext(UserContext);
    const { state } = useLocation() || null;
    const { cid } = state != null ? state : { cid: -1 };
    const { stompClient } = useWebSocket();
    const [count, setCount] = useState(20);
    const [list, setList] = useState([]);
    const [chatroom, setChatroom] = useState(null);
    const profile = GetWithExpiry("profile");
    const navigate = useNavigate();
    const handleMessageSend = () => {
    
        if (inputMessage.trim() !== '' && stompClient && stompClient.connected) {
            const newMessage = { text: inputMessage, sender: 'user' };
            setInputMessage('');

            stompClient.publish({
                destination: '/app/chatroom',
                body: JSON.stringify({
                    cid: cid,
                    uid: activeUser.uid,
                    dContents: inputMessage,
                    dFile: null,
                    nickname: activeUser.nickname,
                    profile: profile,
                    status: chatroom.status,
                }),
            })
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            // event.preventDefault(); // 기본 엔터 기능 비활성화
            handleMessageSend(); // 메시지 전송 함수 호출
        }
    };


    useEffect(() => {
        if (activeUser.uid !== -1 && cid !== -1) {
            const fetchMList = async () => {
                const mlist = await getDmList(cid, count);
                setMessages(mlist);
                const chatr = await getChat(cid, activeUser.uid);
                setChatroom(chatr);
            }

            fetchMList();
            let chatconnect;

            if (stompClient && stompClient.connected) {
                console.log('chatting room connected');
                stompClient.publish({
                    destination: '/app/page',
                    body: JSON.stringify({ userId: activeUser.uid, page: 'chatroom' + cid, action: 'enter' }),
                });

                chatconnect = stompClient.subscribe(`/user/chat/` + cid, (message) => {
                    const data = JSON.parse(message.body);
                    // console.log(data);
                    setMessages(prevMessages => {
                        const messageExists = prevMessages.some(msg => msg.did === data.did);
                        if (!messageExists) {
                            return [data, ...prevMessages];
                        }
                        return prevMessages;
                    });
                });
            }

            return () => {
                if (stompClient && stompClient.connected) {
                    stompClient.publish({
                        destination: '/app/page',
                        body: JSON.stringify({ userId: activeUser.uid, page: 'chatroom' + cid, action: 'leave' }),
                    });
                    console.log('chatting room disconnected');
                }
            }
        }
    }, [activeUser.uid, stompClient]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    const rippleRef = useRef(null);

    const handleMouseDown = (event) => {
        rippleRef.current.start(event);
    };

    const handleMouseUp = () => {
        rippleRef.current.stop();
    };

    const handleBack = () => {
        navigate(-1);
    }

    if (cid === -1) {
        return (
            <div>채팅방 정보가 없습니다.</div>
        )
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <IconButton sx={{ fontSize: '3rem', cursor: 'pointer' }}
                onClick={handleBack}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}>
                <Icon>arrow_back</Icon>
                <TouchRipple ref={rippleRef} center />
            </IconButton>
            <Box
                sx={{
                    marginTop: '-70px',
                    padding: '0px 15px 10px 10px',
                    minHeight: '200px',
                    // height: 'calc(180vh - 200px)',
                    width: '80%',
                    mx: 'auto',
                    overflowY: 'auto',
                }}
            >
                <Stack sx={{ fontSize: 'x-large', fontWeight: 'bold', mx: 'auto' }}>
                    <div style={{ color: 'rgb(88, 67, 135)' }}>
                        {/* <Avatar alt="User" src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${profile}`} />
                        {email} */}
                        {chatroom && chatroom.name}
                        <hr style={{ opacity: '0.4' }} />
                    </div>
                </Stack>
                {/* maxHeight를 사용 스크롤 활성 */}
                <Stack sx={{ mt:2, maxHeight: `calc(100vh - ${inputFieldHeight + 385}px)`, overflowY: 'auto', flexDirection: 'column-reverse' }}> {/* 메시지 영역의 최대 높이를 조정 */}
                    <br />
                    <div ref={messageEndRef} />
                    {messages && messages.map((message, index) => (
                        <Stack
                            key={index}
                            direction='row'
                            justifyContent={message.uid === activeUser.uid ? 'flex-end' : 'flex-start'} sx={{mb:0}}
                        >
                            {message.uid !== activeUser.uid &&
                                <Avatar sx={{ width: 50, height: 50 }}

                                >R</Avatar>}
                            <div style={{borderRadius: { xs: '1%', sm: '1%', md: '80%', lg: '10%' }}} className={message.uid === activeUser.uid ? "message" : "othermessage"}>{message.dContents}</div>
                            {message.uid === activeUser.uid &&
                                <Avatar style={{ marginTop: '10px', marginLeft: '5px', marginBottom: '-10px' }}
                                    sx={{ width: 50, height: 50, marginRight: '.75rem' }}
                                    src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${message.profile}`}

                                >U</Avatar>}
                        </Stack>
                    ))}
                </Stack>
                <Stack
                    sx={{
                        position: 'fixed',
                        bottom: '10px',
                        width: { xs: '60%', sm: '70%', md: '80%' },
                    }}
                >
                    <TextField //원래 이랬음
                        sx={{
                            marginBottom: '4em',
                            height: `${inputFieldHeight}px`, // 입력 필드의 높이 설정
                            width: '70.5%',
                        }}
                        fullWidth
                        placeholder="메시지를 보내세요!"
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
                    {/* {{chatGPT에게 물어본 코드}}
                    <TextField
                        sx={{
                            marginBottom: '4em',
                            height: `${inputFieldHeight}px`,
                            width: '70.5%',
                        }}
                        fullWidth
                        placeholder="메시지를 보내세요!"
                        variant="outlined"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // e.preventDefault(); // 기본 엔터 기능 비활성화
                                handleMessageSend(); // 메시지 전송 함수 호출
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleMessageSend}>
                                        <EastIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    /> */}
                </Stack>
            </Box>
        </DashboardLayout>
    );
}