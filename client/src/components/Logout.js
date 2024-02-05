import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import LogoutFunction from "./LogoutFunction";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await LogoutFunction();
    if (success) {
      navigate("/login");
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <Button onClick={handleLogout}>
      <BiPowerOff />
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
