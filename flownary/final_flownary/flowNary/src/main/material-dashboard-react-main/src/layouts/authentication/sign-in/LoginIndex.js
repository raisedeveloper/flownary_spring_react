// 기본
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Typography } from "@mui/material";
import { SetWithExpiry, UserContext } from "../../../api/LocalStorage";

// firebase 연결
import { login } from "../../../api/firebase";
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// css/componets 연결
import '../theme.css'; // CSS 임포트

// alert 창
import Swal from "sweetalert2";
import axios from "axios";

// react-modal 추가
import Modal from 'react-modal';

// RegisterIndex 컴포넌트 추가
import Register from "../sign-up/RegisterIndex";
import { userRegister } from "api/axiosPost";
import { wrong } from "api/alert";

// 모달 element
Modal.setAppElement('#app');

export default function Login() {
  const [theme, setTheme] = useState('light'); // 초기 테마를 'light'로 설정

  // 애니메이션 상태
  const [animationClass, setAnimationClass] = useState('fade-enter');

  // 이미지 함수
  const backgroundImage = '/images/flowLight.png';
  const logoImage = '/images/LightLogo.png';
  const HelloLogo = '/images/HelloLight.png';
  const logoImage_Modal = '/images/DarkLogo.png'

  const auth = getAuth();

  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleChange = e => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }
  const { updateActiveUser } = useContext(UserContext);

  // 구글로 로그인
  const loginWithGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const data = await signInWithPopup(auth, provider);

      // 이메일로 사용자 조회
      const response = await axios.get('/user/getUserByEmail', {
        params: {
          email: data.user.email
        }
      });

      // 사용자가 존재하지 않으면 회원가입 진행
      if (Object.keys(response.data).length === 0) {
        const result = await axios.post("/user/register", {
          email: data.user.email,
          pwd: 'nn',
          hashuid: data.user.uid,
          provider: 1,
        }).then(res => res.data);
        // 회원가입 성공 시 로컬 스토리지 설정 및 리다이렉트
        SetWithExpiry("uid", result, 180);
        SetWithExpiry("email", data.user.email, 180);
        SetWithExpiry("profile", response.data.profile, 180);
        SetWithExpiry("nickname", response.data.nickname, 180);
        SetWithExpiry("statusMessage", response.data.statusMessage, 180);
        SetWithExpiry("role", response.data.role, 180);
        Swal.fire({
          icon: 'success',
          title: "구글 회원가입에 성공했습니다.",
          showClass: {
            popup: `
                                    animate__animated
                                    animate__fadeInUp
                                    animate__faster
                                `
          },
          hideClass: {
            popup: `
                                    animate__animated
                                    animate__fadeOutDown
                                    animate__faster
                                `
          }
        });
        console.log("구글 회원가입 성공!" + response.data);

      } else {
        SetWithExpiry("uid", response.data.id, 180);
        SetWithExpiry("email", data.user.email, 180);
        SetWithExpiry("profile", response.data.profile, 180);
        SetWithExpiry("nickname", response.data.nickname, 180);
        SetWithExpiry("statusMessage", response.data.statusMessage, 180);
        SetWithExpiry("role", response.data.role, 180);
        updateActiveUser({
          uid: response.data.id, email: data.user.email, nickname: response.data.nickname,
          role: response.data.role,
        });
        Swal.fire({
          icon: 'success',
          title: "구글 로그인에 성공했습니다.",
          showClass: {
            popup: ` animate__animated 
            animate__fadeInUp
            animate__faster `
          },
          hideClass: {
            popup: ` animate__animated
            animate__fadeOutDown
            animate__faster `
          }
        });
        console.log("구글 로그인 성공!" + response.data);

      }
      setAnimationClass('fade-exit');
      setTimeout(() => navigate('/'), 500); // 애니메이션 시간을 고려한 딜레이
    } catch (error) {
      console.error("구글 로그인 오류:", error);
    }
  };

  function handleKeyPress(event) {
    if (event && event.key === 'Enter') {
      event.preventDefault(); // 기본 동작 방지
      handleSubmit();
    }
  }

  const handleSubmit = async () => {
    // e.preventDefault();

    try {
      // 이메일이 빈칸인 경우
      if (!userInfo.email) {
        Swal.fire({
          icon: "warning",
          text: "이메일을 입력해주세요.",
        });
        return;
      }

      // 비밀번호가 빈칸인 경우
      if (!userInfo.password) {
        Swal.fire({
          icon: "warning",
          text: "비밀번호를 입력해주세요.",
        });
        return;
      }
      // Firebase Authentication을 통해 사용자를 인증합니다.
      const checkuser = await signInWithEmailAndPassword(auth, userInfo.email, userInfo.password);

      // 사용자가 존재하는 경우
      if (checkuser) {
        const user = auth.currentUser;
        if (user) {
          const res = await axios.get('/user/getUserByEmail', { params: { email: userInfo.email } })
            .catch(error => console.log(error));
          if (res.data.status === 1) {
            console.log(res.data.status);
            wrong('비활성화 된 계정입니다.')
            return;
          }
          login(userInfo);
          SetWithExpiry("uid", user.uid, 180); // 올바른 uid 설정
          Swal.fire({ position: "center", icon: "success", title: "로그인에 성공하였습니다!", showConfirmButton: false, timer: 1200 });

          SetWithExpiry("uid", res.data.id, 180);
          SetWithExpiry("email", res.data.email, 180);
          SetWithExpiry("profile", res.data.profile, 180);
          SetWithExpiry("nickname", res.data.nickname, 180);
          SetWithExpiry("statusMessage", res.data.statusMessage, 180);
          SetWithExpiry("role", res.data.role, 180);
          updateActiveUser({
            uid: res.data.id, email: res.data.email, nickname: res.data.nickname,
            role: res.data.role
          });

          navigate('/home');
          setAnimationClass('fade-exit');
          setTimeout(() => navigate('/home'), 500);
        }
      }
    } catch (error) {
      // Firebase 오류 처리를 좀 더 일반적인 메시지로 통합
      Swal.fire({
        icon: "error",
        title: "앗! 잠시만요",
        text: "이메일 혹은 비밀번호가 맞지 않아요.",
        footer: '<a href="/authentication/sing-up">혹시 계정이 없으신가요?</a>'
      });
      console.error(error);
    }
  }

  // 모달 상태
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    setModalIsOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className={`background ${theme} ${animationClass}`} style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Card id='cardMain' className="cardMain">
        <div id='login-box' className="loginBox">
          <div className={`welcome-message`}>
            <img src={HelloLogo} alt='Hello' style={{ maxWidth: '10%' }} />
          </div>
          <img src={logoImage} alt='LOGO' style={{ maxWidth: '20%' }} />

          <br />
          <input type="email" name='email' placeholder="닉네임 혹은 이메일" className="commonInputStyle"
            onChange={handleChange} onKeyUp={handleKeyPress} />
          <br />
          <input type="password" name='password' placeholder="비밀번호" className="commonInputStyle"
            onChange={handleChange} onKeyUp={handleKeyPress} style={{ marginBottom: '1rem' }} />
          <br />
          <button className="fill" onClick={handleSubmit}><img style={{ paddingRight: '10px', margin: '-5px', width: '1.5em' }} src="/images/favicon.png" alt="f" />로그인</button>
          <Typography style={{
            marginTop: '10px', marginBottom: '8px', fontSize: 'small',
            color: theme === 'light' ? '#dca3e7' : '#ffffff'
          }}>또는</Typography>
          <Link to="#" onClick={loginWithGoogle} className={`custom-button ${theme}`}>
            <img style={{ paddingRight: '5px', margin: '-5px', width: '1.55em' }} src="/images/icons/Google.png" alt="Google" />
            <span>       로그인</span>
          </Link>
          <br /><br />
          <Typography style={{ fontSize: 'small', marginBottom: '1rem', color: theme === 'light' ? '#dca3e7' : '#ffffff' }}>혹시 계정이 없으신가요?</Typography>
          <div>
            <Link to="#" onClick={openModal} className={`custom-button ${theme}`}>가입하기</Link>
          </div>
          <br />
        </div>
      </Card>

      {/* 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Register Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-content">
          <div className={`welcome-message-Modal`}>
            <img src={logoImage_Modal} alt='LOGO'
              style={{
                width: '10rem',
                height: '3em',
                marginBottom: '-1rem'
              }} />

          </div>
          <Typography sx={{ mb: 2, mt: 1, fontSize: 'large' }}>환영합니다!</Typography>
          <Typography style={{ fontSize: 'small' }}>아래 가입양식에 따라 회원가입을 진행해주세요</Typography>
          <Register closeModal={closeModal} /> {/* closeModal 전달 */}
        </div>
      </Modal>
    </div>
  );
}
