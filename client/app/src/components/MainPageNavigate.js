import React from "react";
import { useNavigate } from "react-router-dom";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import styled from "styled-components";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      navigate("/");
    } catch (error) {
      console.error("Main Page Navigate Failed");
    }
  };

  return (
    <Button onClick={handleLogout}>
      <HiChatBubbleLeftRight />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem;
  border-radius: 0.5rem;
  background-color: red;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
