import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStories, addFriend, getFriends, searchUser } from "../utils/APIRoutes";
import AddStory from "../components/AddStoryNavigate";
import UserStoriesContacts from "../components/UserStories";
import Atepa from "../assets/loader.gif";
import logo from "../assets/LOGO.png";
import MainPageNavigate from "../components/MainPageNavigate";

export default function InfoStoryStory() {
  const [currentUser, setCurrentUser] = useState(undefined);
	const [currentSearchUser, setCurrentSearchUser] = useState(undefined);

  const [token, setToken] = useState(); 
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const page = 1;
  const perPage = 15;
  const toastOptions = {
    position: "bottom-right",
    autoClose: 10000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          ));
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      
    };
    fetchData();
  }, [currentUser, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${searchUser}?text=${searchText}&page=${page}&perPage=${perPage}`,
      {
        headers: {
        'Content-Type': 'application/json',
        'token': token,
        },
      });
      console.log(response.data.response);
      setSearchResult(response.data.response);
    } catch (error) {
      console.error("Error searching friends:", error);
    }
  };

  const changeCurrentUser = (index, user) => {
    setCurrentSelected(index);
    setCurrentSearchUser(user)
  };

	const postFriend = async () => {

		if(!currentSearchUser)  return  toast.error(`Bir Kullanıcı Seçmediniz`, toastOptions);
    console.log(currentSearchUser);
			const response =await axios.post(`${addFriend}/${currentUser._id}`, {
				friendId: currentSearchUser._id,
				userMail: currentSearchUser.userMail,
				userNickName: currentSearchUser.userNickName,
				userName: currentSearchUser.userName,
				avatarImage: currentSearchUser.avatarImage
			})
			.then((response) => console.log(response) )
			.catch((error) => console.log(error) )
	};


  return (
    <>
      <FormContainer>
      <div className="forms-container">
        <form className="add-story-form">
          <h>Anasayfa</h>
          <MainPageNavigate />
          <h></h>
          <h></h>
          <h>Arkadaşlıktan Çıkar</h>
          {/* <UserStoryDelete storyId={ currentStoryId } user={ currentUser } token={token} /> */}
          <h></h>
          <h></h>
          <h>Story Ekle</h>
          <AddStory />
        </form>
        <form className="add-frineds" onSubmit={handleSearch}>
          <h>Ara</h> 
          <textarea
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Arkadaş ara..."
            ></textarea>
            <button type="submit">Ara</button>
            <div className="search-result">
            {searchResult.map((user, index) => {
              return (
                <div
                  key={user._id}
                  className={`user ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentUser(index, user)}
                >
                  <div className="avatar">
                    { <img
                      src={`data:image/svg+xml;base64,${user.avatarImage}`}
                      alt={`${user.userNickName}`}
                    /> }
                  </div>
                  <div className="userName">
                    <h3>{user.userNickName}</h3>
                  </div>
                </div>
              );
            })} 
        </div>
					<form className="add-button">
						<button type="button" onClick={postFriend} >Ekle</button>
					</form>
        </form >
				
        <form className="users-friends">
        <h>Arkadaşlarım</h>
         
        </form >
      </div>
      <span>
        <Link to="/">Go Chat</Link>
      </span>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
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

  .forms-container {
    display: flex;
    gap: 1rem; 
  }
  .add-story-form {
    height: 70vh;
    width: 13vw;
    align-self: flex-center;
    align-items: center;
    button {
      background-color: #4e0eff;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 0.5 rem;
      text-transform: uppercase;
      &:hover {
        background-color: #4e0ead;
      }
    }
  }

  .search-result {
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
    .user {
      background-color: #ffffff34;
      min-height: 4.5rem;
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
  .users-has-story {
    height: 70vh;
    width: 23vw;
    align-self: flex-center;
    align-items: center;
  }
  .access-story-form{
    height: 70vh;
    width: 23vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
  }
  .users-story {
    height: 70vh;
    width: 28vw;
    align-self: flex-center;
    align-items: center;
    img {
      width: 23vw;
      height: 48vh;
      object-fit: cover; 
      object-position: center; 
    }
  }
  h{
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 16px;
  }
 
  .users-has-story {
    align-self: flex;
    grid-template-columns: 25% 75%;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4aaaff;
      text-decoration: none;
      font-weight: bold;
    }
  }
  
`;