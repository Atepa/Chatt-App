import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStories, postAccessStory } from "../utils/APIRoutes";
import AddStory from "../components/AddStoryNavigate";
import HasStoryContacts from "../components/HasStoryContacts";
import LogoutFunction from "../components/LogoutFunction";
import Atepa from "../assets/loader.gif";
import logo from "../assets/logo.svg";
import InstaStory from "react-insta-stories";
import MainPageNavigate from "../components/MainPageNavigate";
import UserStoryNavigate from "../components/UserStoryNavigate";

export default function Story() {
  const [userHasStory, setUserHasStory] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentStory, setCurrentStory] = useState(undefined);
  const [token, setToken] = useState('');

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const stor = [
    {
      url: `${Atepa}`,
      duration: 15000,
      header: {
        heading: `Chatimsi`,
        subheading: 'Posted now',
        profileImage: logo,
        // profileImage: 'https://picsum.photos/100/100',
      },
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const token = JSON.parse(
            localStorage.getItem('token')
          );		
          const axiosInstance = axios.create({
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            }
          });
          try {
            const response = await axiosInstance.get(`${getStories}`);
            if (response.status !== 200) {
              toast.error(response.data.msg || 'Bir hata oluştu', toastOptions);
            } else {
              setUserHasStory(response.data.response);
            }
          } catch (error) {
            if(error.response.status === 401) {
              const success = await LogoutFunction();
              if (success) {
                toast.error("oturumun süresi bitmiştir", toastOptions);
                navigate("/login");
              } else {
                toast.error("Logout failed", toastOptions);
              }
            }
            else toast.error(`${error.message}`, toastOptions);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchData();
  }, [currentUser, navigate]);


  const handleStoryChange = async (story) => {
    const token = JSON.parse(
      localStorage.getItem('token')
    );		
    setToken(token);
    let updatedStor;

    await axios.get(`${getStories}/${story._id}`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
    .then( res => {
      const storyId = res.data.response.map(story => `${story._id}`);
      const paths = res.data.response.map(story => `${process.env.REACT_APP_URL}${story.storyPath}`);
      const userNames = res.data.response.map(story => `${story.senderUserNickName}`);
      const duration = res.data.response.map(story => `${story.duration}`);
      const createdAt = res.data.response.map(story => {
      const dateObject = new Date(story.createdAt);
      const saat = dateObject.getHours();
      const dakika = dateObject.getMinutes();
      return `${saat}:${dakika}`;
      });
      updatedStor = paths.map((path, index) => {
        return {
          _id: storyId[index],
          url: path,
          duration: duration[index] || 5000, // stor'daki değeri al, eğer yoksa varsayılan değeri kullan
          header: {
            heading: userNames[index],
            subheading: createdAt[index],
          },
        };
      });
      setCurrentStory(updatedStor);  
    })
    .catch(error => {
      if(error.response?.status === 404)
        toast.error(`${error.response.data.msg}`, toastOptions)
      else 
        toast.error(`${ error.message}`,toastOptions);
    })   
  };

  const handleStoryStart = async (story) => {
    if (currentStory) 
    {
      if (!story) {
        return;
      }
      try {
        await axios.post(`${postAccessStory}/${currentUser._id}/${story._id}`, {
          userNickName: currentUser.userNickName,
        }, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error(`${error.response.data.msg}`, toastOptions);
        } else {
          toast.error(`${error.message}`, toastOptions);
        }
      }
    }
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
          <h>Güncelle</h>
          <UserStoryNavigate />
          <h></h>
          <h></h>
          <h>Story Ekle</h>
          <AddStory />
        </form>
        <form className="users-has-story">
          <h>Arkadaşların</h> 
          <HasStoryContacts contacts={userHasStory} changeChat={handleStoryChange}/>
        </form >
        <form className="users-story">
        <h>Story</h>
          <InstaStory
            key={currentStory ? currentStory.length : 0} 
            stories={ 
              currentStory?.map( story =>({ 
              ...story,
            })) 
            || stor.map(story => ({
              ...story,
            })) }
            loop={true}
            defaultInterval={6000}
            width={400}
            height={500}
            storyContainerStyles={{ borderRadius: 8, overflow: "hidden", backgroundColor: "black",border: "2px solid #333"}}
            onStoryEnd={(s, st) => handleStoryStart(st)}
            onAllStoriesEnd={(s, st) => console.log("all stories ended", s, st)}
            onStoryStart={(s, st) =>  handleStoryStart(st)}
            storyStyles={{
              width: '100%', 
              height: '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
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
  .users-has-story {
    height: 70vh;
    width: 30vw;
    align-self: flex-center;
    align-items: center;
  }
  .users-story {
    height: 70vh;
    width: 30vw;
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