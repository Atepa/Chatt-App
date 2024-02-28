import React, { useState, useEffect } from "react";
import axios, { Axios } from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFriends ,addFriend, searchUser, removeFriend } from "../utils/APIRoutes";
import AddStory from "../components/AddStoryNavigate";
import MainPageNavigate from "../components/MainPageNavigate";
import { BiSolidImageAdd } from "react-icons/bi";

export default function InfoStoryStory() {
  const [currentUser, setCurrentUser] = useState(undefined);
	const [currentSearchUser, setCurrentSearchUser] = useState(undefined);
  const [token, setToken] = useState(); 
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [userFriends, setUserFriends] = useState(undefined);
  const [currentSelectedFriend, setCurrentSelectedFriend] = useState(undefined);
  const [currentFriendUser, setCurrentFriendUser] = useState(undefined);
  
  const navigate = useNavigate();
  const page = 1;
  const perPage = 20;
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const getUserFriends = async (userId, tokn) => {
    try {
      const response = await axios.get(`${getFriends}/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tokn,
        },
      });
      setUserFriends(response.data.response.friendsList);
    } catch (error) {
      toast.error(`${error.message}`, toastOptions);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      const userToken = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!userToken) {
        navigate("/login");
        return;
      }
      const userData = JSON.parse(userToken);
      setCurrentUser(userData);
      setToken(JSON.parse(
        localStorage.getItem('token')
      ));      
      const tokn=JSON.parse(
        localStorage.getItem('token')
      );
      getUserFriends(userData._id, tokn);
    };
    fetchData();
  }, [navigate,setUserFriends]);

  const handleSearch = async (e) => {
    e.preventDefault();
      await axios.get(`${searchUser}?text=${searchText}&page=${page}&perPage=${perPage}`,
      {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        },
      })
      .then((response) => setSearchResult(response.data.response))
      .catch((error) => toast.error(`${error.message}`, toastOptions));
  };

  const changeCurrentUser = (index, user) => {
    setCurrentSelected(index);
    setCurrentSearchUser(user)
  };

  const changeCurrentFriend = (index, user) => {
    setCurrentSelectedFriend(index);
    setCurrentFriendUser(user)
  };

	const postFriend = async () => {
		if(!currentSearchUser)  return  toast.error(`Bir Kullanıcı Seçmediniz`, toastOptions);
		  await axios.post(`${addFriend}/${currentUser._id}`, {
				friendId: currentSearchUser._id,
				userMail: currentSearchUser.userMail,
				userNickName: currentSearchUser.userNickName,
				userName: currentSearchUser.userName,
				avatarImage: currentSearchUser.avatarImage
			},{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      })
			.then((response) => {
        toast.success(`${response.data.msg}`, toastOptions);
        getUserFriends(currentUser._id, token);
      })
			.catch((error) => toast.error(`${error.message}`, toastOptions));
	};

  const DeleteFriend = async (e) => {
		e.preventDefault();
		if(!currentFriendUser)  return  toast.error(`Bir Arkadaş Seçmediniz`, toastOptions);
		  await axios.delete(`${removeFriend}/${currentUser._id}/${currentFriendUser.friendId}`, 
			{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      })
			.then((response) => 
      {
        toast.success(`${response.data.msg}`, toastOptions);
        getUserFriends(currentUser._id, token);
      })
			.catch((error) => toast.error(`İşlem Başarısız ${error.message}`, toastOptions));
	};

  return (
    <>
      <FormContainer>
      <div className="forms-container">
        <form className="add-navigate-form">
          <h>Anasayfa</h>
          <MainPageNavigate />
          <h></h>
          <h></h>
          <h>Arkadaşlıktan Çıkar</h>
          <Button onClick={DeleteFriend}>
            <BiSolidImageAdd />
          </Button>
          <h></h>
          <h></h>
          <h>Story Ekle</h>
          <AddStory />
        </form>
        <form className="add-frineds" onSubmit={handleSearch}>
          <h>Ara</h> 
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Arkadaş Ara..."
            name="userMail"
            minLength="3"
          />
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
              <button type="button" onClick={postFriend} >Ekle</button>
          </form >
          <form className="users-friends">
          <h>Arkadaşlarım</h>
            {userFriends && userFriends.map((user, index) => {
              return (
                <div 
                  key={user.friendId}
                  className={`user ${index === currentSelectedFriend ? "selected" : ""}`}
                  onClick={() => changeCurrentFriend(index, user)}
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

  h{
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: bold;
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  .forms-container {
    display: flex;
    gap: 1rem; 
  }

  .add-navigate-form {
    height: 70vh;
    width: 15vw;
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
  .users-friends {
    height: 70vh;
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
      width: 100%;
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

  .search-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto; 
    max-height: 20vh; 
    min-height: 20vh; 
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
      width: 100%;
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