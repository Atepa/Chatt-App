import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import Atepa from "../assets/loader.gif";

export default function Welcome() {

  const [userMail, setUserMail] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setUserMail(userData.userMail);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchData();
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userMail}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
      <img src={Atepa} alt="" />

      
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  overflow-y: auto; 
      overflow-x: auto; 
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;