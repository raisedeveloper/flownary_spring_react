import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Home from "layouts/home/HomeIndex";

const UserContext = createContext(null);

/** localStorage에 key 값을 만료시간을 두고 저장하기
 * @param {*} key 저장할 키 이름
 * @param {*} value 저장할 값
 * @param {*} ttl 만료시간 (1당 1분)
 */
export function SetWithExpiry(key, value, ttl) {
    const now = new Date();

    const item = {
        value: value,
        expiry: now.getTime() + ttl * 1000 * 60,
    }

    localStorage.setItem(key, JSON.stringify(item));
}

/** 만료시간이 있는 localstorage 데이터를 받아오기
 * @param {*} key 저장한 키
 * @returns 
 */
export function GetWithExpiry(key) {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
        if (key == "uid")
            return -1;
        if (key == "nickname")
            return "";
        
        return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (!item.value) {
        localStorage.removeItem(key);
        if (key == "uid")
            return -1;
        if (key == "nickname")
            return "";
        return null;
    }

    if (now.getTime() > parseInt(item.expiry)) {
        localStorage.removeItem(key);
        if (key === 'uid')
        {
            localStorage.removeItem("email");
            localStorage.removeItem("profile");
            localStorage.removeItem("nickname");
            localStorage.removeItem("statusMessage");
            localStorage.removeItem("role");
            window.location.reload();
            return -1;
        }
        return null;
    }

    return item.value;
}

/** 로그인 한 정보를 어디서든 사용할 수 있음
 * GetWithExpiry로 미리지정해둠
 * @param {*} activeUser - uid, email, nickname 
 * @returns 
 */
const ContextProvider = ({children}) => {
    const [activeUser, setActiveUser] = useState({
        uid: -1,
        email: '',
        nickname: '',
        role: 0,
    })

    const updateActiveUser = (user) => {
        setActiveUser(user);
    }

    useEffect(() => {
        const uid = GetWithExpiry("uid");
        const email = GetWithExpiry("email");
        const nickname = GetWithExpiry("nickname");
        const role = GetWithExpiry("role");
        setActiveUser({uid, email, nickname});
    }, []);

    return (
        <UserContext.Provider value={{activeUser, updateActiveUser}}>
            {children}
        </UserContext.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserContext, ContextProvider };