import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStories, getAccessStory } from "../utils/APIRoutes";
import AddStory from "../components/AddStoryNavigate";
import UserStoriesContacts from "../components/UserStories";
import Atepa from "../assets/loader.gif";
import logo from "../assets/LOGO.png";
import InstaStory from "react-insta-stories";
import MainPageNavigate from "../components/MainPageNavigate";
import UserStoryDelete from "../components/UserStoryDelete";
import UserAccessStory from "../components/UsersAccesStory";
import LogoutFunction from "../components/LogoutFunction";

export default function InfoStoryStory() {
  const [userStories, setUserStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentStory, setCurrentStory] = useState(undefined);
  const [currentStoryId, setCurrentStoryId] = useState(undefined);
  const [currentStoryAccess, setCurrentStoryAccess] = useState(undefined);
  const [token, setToken] = useState(); 

  const toastOptions = {
    position: "bottom-right",
    autoClose: 10000,
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
          ));
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          setToken(JSON.parse(
            localStorage.getItem('token')
          ));
          const tkn = JSON.parse(
            localStorage.getItem('token')
          );
          const axiosInstance = axios.create({
          headers: {
              'Content-Type': 'application/json',
              'Authorization': tkn,
          }
          });
        await axiosInstance.get(`${getStories}/${currentUser._id}`)
        .then( response => {
            if (response.status !== 200) {
                toast.error(`${response.data.msg}`, toastOptions);
            } else {
                setUserStories(response.data.response);
            }
        })
        .catch( async error => {
          if(error.response?.status === 401) {
            const success = await LogoutFunction();
            if (success) {
              toast.error("oturumun süresi bitmiştir", toastOptions);
              setTimeout(() => {
                navigate("/login");
              }, 3000); 
            }
            toast.error("Çıkış Yapıldı", toastOptions);
          }
          if(error.response?.status === 404){
            toast.error(`${error.response.data.msg}`, toastOptions)
          } else toast.error(`${ error.message}`,toastOptions);
        })
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchData();
  }, [currentUser, navigate, setUserStories]);

  const handleStoryChange = async (story) => { 
    setCurrentStoryId(story._id)
    const modifiedStory = [{
      duration: story.duration,
      header: story.senderUserNickName,
      subheading: story.createdAt,
      url: `${process.env.REACT_APP_URL}${story.storyPath}`
    }];
    setCurrentStory(modifiedStory);

    const axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });      
    await axiosInstance.get(`${getAccessStory}/${currentUser._id}/${story._id}`)
    .then( (response) => {
      if (response.status !== 200)  toast.error(`${response.data.msg}`, toastOptions);
      else  setCurrentStoryAccess(response.data.accessUsers);
    })
    .catch(async (error)=> {
      if(error.response?.status === 401) {
        const success = await LogoutFunction();
        if (success) {
          toast.error("oturumun süresi bitmiştir", toastOptions);
          setTimeout(() => {
            navigate("/login");
          }, 3000); 
        }
        toast.error("Çıkış Yapıldı", toastOptions);
      }
      if(error.response?.status === 404){
        toast.error(`${error.response.data.msg}`, toastOptions)
      } else toast.error(`${ error.message}`,toastOptions);
    })
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
          <h>Seçileni Sil</h>
          <UserStoryDelete storyId={ currentStoryId } user={ currentUser } token={token} />
          <h></h>
          <h></h>
          <h>Story Ekle</h>
          <AddStory />
        </form>
        <form className="users-has-story">
          <h>Storylerin</h> 
          <UserStoriesContacts contacts={ userStories } changeChat={handleStoryChange}/>
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
            onStoryEnd={(s, st) => console.log("story ended", s, st)}
            onAllStoriesEnd={(s, st) => console.log("all stories ended", s, st)}
            onStoryStart={(s, st) => console.log("story started", s, st)}
            storyStyles={{
              width: '100%', 
              height: '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </form >
        <form className="access-story-form">
          <h>Story'ne Erişenler</h>
          <UserAccessStory accessUsers={currentStoryAccess} />
        </form>
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