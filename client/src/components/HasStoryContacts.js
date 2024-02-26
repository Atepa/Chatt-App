import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function HasStoryContacts({ contacts, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setCurrentUserImage(data.avatarImage);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
       {currentUserImage && currentUserImage && (
        <Container>
          <div className="contacts">
          {contacts && contacts.length > 0 && contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  { <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt={`${contact.userNickName}`}
                  /> }
                </div>
                <div className="userName">
                  <h3>{contact.userNickName}</h3>
                </div>
              </div>
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  height: 748vh;
  width: 25vw;
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  
  .contacts {
    margin-top: 10px;
    height: 48vh;
    width: 25vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .userName {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }
  span {
    background-color: #CEC2EB;  
    color: gray;
    padding: 5px 10px;  
    border-radius: 0.5rem; 
  }
  
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .userName {
      h2 {
        color: white;
      }
    }
  }

`;