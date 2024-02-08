import React from "react";
import { MdDeleteForever } from "react-icons/md";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { deleteStory } from "../utils/APIRoutes";

export default function UserStoryDelete({ storyId }) {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleDelete = async () => {
    await axios.delete(`${deleteStory}/${storyId}`)
    .then(res => {
        if(res.status !== 200) 
            toast.error(`err-> ${res.data.msg}`, toastOptions) 
        
        else {
            toast.success(`Story Silindi`, toastOptions);
            setTimeout( ()=> {
                window.location.reload();
            },3000)
        }
    })
    .catch (error => {
        toast.error(`error-> ${error.message}`, toastOptions) 
    })
  };

  return (
    <Button onClick={handleDelete}>
      <MdDeleteForever />
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
