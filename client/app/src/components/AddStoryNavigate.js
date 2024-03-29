import React from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidImageAdd } from "react-icons/bi";
import styled from "styled-components";

export default function Story() {
  const navigate = useNavigate();

  const handleClick = async () => { 
    const currentPath = window.location.pathname;
    currentPath === "/" ? navigate("/story") : navigate("/story/upload")
  };
  return (
    <Button onClick={handleClick}>
      <BiSolidImageAdd />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem;
  border-radius: 0.5rem;
  background-color: purple;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
