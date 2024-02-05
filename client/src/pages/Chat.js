import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled, { keyframes } from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import LogoutFunction from "../components/LogoutFunction";
import { toast } from "react-toastify";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
   useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const token = await JSON.parse(
            localStorage.getItem('token')
          );
          const axiosInstance = axios.create({
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            }
          });

          try {
            const response = await axiosInstance.get(`${allUsersRoute}/${currentUser._id}`);
            if (response.status !== 200) {
              toast.error(response.data.msg || 'Bir hata oluştu', toastOptions);
            } else {
              setContacts(response.data.users);
            }
          } catch (error) {
            if(error.response.status === 401) {
              const success = await LogoutFunction();
              if (success) {
                toast.error("oturumun süresi bitmiştir", toastOptions);
                setTimeout(() => {
                  navigate("/login");
                }, 3000); 
                console.error("Logout failed");
              }
            }
            toast.error("oturumun süresi bitmiştir", toastOptions);

          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchData();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  
  return (
    <>
      <Container>
        <Alert>
          Mesajlarınız her gün saat 00.00 ve 12.00 da silinir...
        </Alert>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  overflow-y: auto; 
  overflow-x: auto; 

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 700px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  `;
  const Alert = styled.div`
    background-color: yellow  ;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  // Yatayda ortalamak için eklenen stil
    gap: 1rem;
    color: red; 
    height: 1rem;
    width: 35rem;
    border-radius: 10px; // Kenarları yuvarlamak için
    font-size: 18px; 
    font-weight: bold;
  }`;