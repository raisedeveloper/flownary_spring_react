import React, { useContext } from 'react';
import { getFollowList } from 'api/axiosGet';
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, List, Paper, ListItem, Avatar, Button, Box } from '@mui/material';
import { UserContext } from 'api/LocalStorage';
import PropTypes from 'prop-types';
import { deleteFollow } from 'api/axiosPost';
import { useRemoveFollow } from 'api/customHook';

export default function FollowList(props) {

  const uid = props.uid;

  const handleClose2 = props.handleClose2

  const navigate = useNavigate();


  const followList = useQuery({
    queryKey: ['followlist', uid],
    queryFn: () => getFollowList(uid),
  });

  const deleteFollowing = useRemoveFollow();
  const deleteFollowForm = (sendData) => {
    deleteFollowing(sendData);
  }

  const deleteFollowButton = (fid) => {
    deleteFollowForm(fid);
  }

  const handleMyPage = (uid) => {
    handleClose2();
    navigate("/mypage", { state: { uid: uid } }); 
  }


  if (followList.isLoading) {
    return (
      <div>Loading</div>
    )
  }
  console.log(followList.data)
  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
        {followList.data.length > 0 && followList.data.map((data, idx) => (
          <Paper key={idx} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              onClick={() => handleMyPage(data.fuid)}
              sx={{ cursor: 'pointer', width: 56, height: 56, mr: 2 }}
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.profile}`}
              />
              {console.log(data.uid)}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                {data.nickname}
              </Typography>
            </Box>
            <Button
              onClick={() => deleteFollowButton(data.fid)}
            >
              취소
            </Button>
          </Paper>
        ))}
      </Box>
    </>
  );
}

FollowList.propTypes = {
  uid: PropTypes.number,
  handleClose2 : PropTypes.func
};