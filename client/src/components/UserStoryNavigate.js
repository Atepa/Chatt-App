import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import styled from "styled-components";

export default function UserStoryNavigate() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        navigate("/story/info");
    } catch (error) {
        console.error("failed");
    }
  };

  return (
    <Button onClick={handleLogout}>
      <FaEdit />
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
