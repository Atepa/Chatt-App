import React from "react";
import styled from "styled-components";

export default function UserAccessStory({ accessUsers }) {
  return (
    <div className="contacts">
      <ul>
        {accessUsers && accessUsers.map((user, index) => (
          <div key={index}>
          <li>{user.userNickName}</li>
          <br /> 
        </div>
        ))}
      </ul>
    </div>
  );
}

const Container = styled.div`
height: 100%;
width: 20vw;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background-color: #080420;
color: #ffffff;
`;