import React, { useContext } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, List, Paper, ListItem, Avatar, Button, Box } from '@mui/material';
import { UserContext } from 'api/LocalStorage';
import PropTypes from 'prop-types';
import { getFollowMeList } from 'api/axiosGet';
import { deleteFollow } from 'api/axiosPost';

export default function FollowMeList(props) {

  const uid = props.uid;

  const navigate = useNavigate();

  const handleClose3 = props.handleClose3

  const followMeList = useQuery({
    queryKey: ['followMelist', uid],
    queryFn: () => getFollowMeList(uid),
  });

  // const deleteFollowButton = (fid) => {
  //   deleteFollow(fid);
  // }

  const handleMyPage = (uid) => {
    handleClose3();
    navigate("/mypage", { state: { uid: uid } }); 
  }




  if (followMeList.isLoading) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
        {followMeList.data.length > 0 && followMeList.data.map((data, idx) => (
          <Paper key={idx} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              onClick={() => handleMyPage(data.uid)}
              sx={{ cursor: 'pointer', width: 56, height: 56, mr: 2 }}
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${data.profile}`}
            />
            {console.log(data.uid)}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                {data.nickname}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
}

FollowMeList.propTypes = {
  uid: PropTypes.number,
  handleClose3 : PropTypes.func
};