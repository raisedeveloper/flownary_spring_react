import { Dashboard } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Grid, Modal, Stack, Table, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "api/LocalStorage";
import { getFollowMeList } from "api/axiosGet";
import { getFamilyList } from "api/axiosGet";
import { getChatCid } from "api/axiosGet";
import { getFollowList } from "api/axiosGet";
import { insertNotice } from "api/axiosPost";
import { useRemoveFollow } from "api/customHook";
import { isEmpty } from "api/emptyCheck";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Message, Add, Close } from '@mui/icons-material';
import { wrong } from "api/alert";


export default function Follow() {

    const { activeUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [modalopen, setModalopen] = useState(false);
    const [me, setMe] = useState(false);
    const [currentUid, setCurrentUid] = useState(-1);

    const { data: followlist, isLoading, isError } = useQuery({
        queryKey: ['followlist', activeUser.uid],
        queryFn: () => getFollowList(activeUser.uid),
    });

    const { data: followmelist, isLoading: isLoading2, isError: isError2 } = useQuery({
        queryKey: ['followmelist', activeUser.uid],
        queryFn: () => getFollowMeList(activeUser.uid),
    });

    const { data: familylist, isLoading: isLoading3, isError: isError3 } = useQuery({
        queryKey: ['followfamilylist', activeUser.uid],
        queryFn: () => getFamilyList(activeUser.uid),
        enabled: modalopen,
    })

    const handleme = () => {
        setMe(prev => !prev);
    }

    const removeFollow = useRemoveFollow();
    const removeFollowForm = (id) => {
        removeFollow(id);
    }

    if (activeUser.id === -1) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Typography>
                    유저 정보 불러오기 실패
                </Typography>
            </DashboardLayout>
        )
    }

    if (isLoading || isLoading2) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <Typography>
                    로딩 중...
                </Typography>
            </DashboardLayout>
        )
    }

    const handleMyPage = (uid) => {
        navigate("/mypage", { state: { uid: uid } }); // state를 통해 navigate 위치에 파라메터 제공
    }

    const findChatMake = async (uid) => {
        if (uid && uid == activeUser.uid)
            return;

        const cid = await getChatCid(uid, activeUser.uid);

        if (cid == -1) {
            navigate("/chattingtemp", { state: { uid1: activeUser.uid, uid2: uid } });
        }
        else {
            navigate("/chatlist", { state: { cid: cid } });
        }
    }

    const handleModalOpen = (uid) => {
        setModalopen(true);
        setCurrentUid(uid);
    }

    const handleModalClose = () => {
        setModalopen(false);
        setCurrentUid(-1);
    }

    const inviteFamily = async (faid) => {
        await insertNotice(currentUid, activeUser.uid, 5, faid);

        alert('패밀리 가입 요청을 보냈습니다');
    }

    const handleDelete = (fid) => {
        wrong("플로우 취소되었습니다")
        removeFollowForm(fid);
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Button variant="contained" color="success" onClick={handleme} sx={{ mb: 3 }}>{me ? '나를 플로우한 사람 보기' : '내가 플로우한 사람 보기'}</Button>
            {me ? <Typography sx={{ color: 'lightcoral', my: 1, fontWeight: 'bold', fontSize: '2rem', bgcolor: 'none', textAlign: 'center' }}>
                플로잉 리스트
            </Typography> : <Typography sx={{ color: 'lightcoral', my: 1, fontWeight: 'bold', fontSize: '2rem', bgcolor: 'none', textAlign: 'center' }}>
                플로워 리스트
            </Typography>}
            <TableContainer>
                <Table>
                    {/* 팔로잉 : 내가 팔로우 한사람들 , 팔로워 : 사람들이 나를 팔로우 */}
                    {me ? (
                        <TableRow sx={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc', }}>
                            <TableCell>프로필</TableCell>
                            <TableCell>닉네임</TableCell>
                            <TableCell>플로잉 날짜</TableCell>
                            <TableCell>기능</TableCell>
                        </TableRow>
                    )
                        : (
                            <TableRow sx={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc', }}>
                                <TableCell>프로필</TableCell>
                                <TableCell>닉네임</TableCell>
                                <TableCell>플로워 날짜</TableCell>
                                <TableCell>기능</TableCell>
                            </TableRow>
                        )}
                    {me && followlist && !isEmpty(followlist) && followlist.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <Avatar
                                    src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${item.profile}`}
                                    alt="profile"
                                    onClick={() => handleMyPage(item.fuid)}
                                />
                            </TableCell>
                            <TableCell onClick={() => handleMyPage(item.fuid)}>{item.nickname}</TableCell>

                            <TableCell>
                                {new Date(item.time).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<Message />}
                                    sx={{ marginRight: '10px', color: 'blueviolet' }}
                                    onClick={() => findChatMake(item.fuid)}
                                >
                                    메세지
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<Add />}
                                    sx={{ marginRight: '10px' }}
                                    onClick={() => handleModalOpen(item.fuid)}
                                >
                                    초대
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<Close />}
                                    onClick={() => handleDelete(item.fid)}
                                >
                                    해제
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!me && followmelist && !isEmpty(followmelist) && followmelist.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <Avatar
                                    src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${item.profile}`}
                                    alt="profile"
                                    onClick={() => handleMyPage(item.uid)}
                                />
                            </TableCell>
                            <TableCell onClick={() => handleMyPage(item.uid)}>{item.nickname}</TableCell>

                            <TableCell>
                                {new Date(item.time).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<Message />}
                                    sx={{ marginRight: '10px', color: 'blueviolet' }}
                                    onClick={() => findChatMake(item.uid)}
                                >
                                    메세지
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<Add />}
                                    sx={{ marginRight: '10px' }}
                                    onClick={() => handleModalOpen(item.uid)}
                                >
                                    초대
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}

                </Table>
            </TableContainer>

            <Modal
                open={modalopen}
                onClose={handleModalClose}
                aria-labelledby="modaltitle"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modaltitle">
                        패밀리 초대하기
                    </Typography>
                    <Stack direction={'column'}>
                        {isLoading3 && <div>Loading...</div>}
                        {familylist && !isEmpty(familylist) && familylist.map((item, idx) => (
                            <Card sx={{ marginBottom: '10px' }} key={idx}>
                                <CardHeader
                                    avatar={<Avatar alt={item.leadername} src={item.leaderprofile} onClick={() => handleMyPage(item.leaderuid)} />}
                                    title={item.name}
                                    subheader={item.regTime}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        유저 수 : {item.usercount}
                                        <Button onClick={() => inviteFamily(item.faid)}>초대하기</Button>
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            </Modal>
        </DashboardLayout >
    )
}