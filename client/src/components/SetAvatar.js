import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import LogoutFunction from "../components/LogoutFunction";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [token, setToken] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkLocalStorage = () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      }
    };
    checkLocalStorage();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {

      const  result = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const token = setToken(JSON.parse(
        localStorage.getItem('token')
      ));		
      const axiosInstance = axios.create({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });
      await axiosInstance.post(`${setAvatarRoute}/${result._id}`, {
        avatarImage: avatars[selectedAvatar],
      })
      .then( response => {
        if(response.data.response.isAvatarImageSet)
        {
          result.isAvatarImageSet = true;
          result.avatarImage = avatars[selectedAvatar];
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(result)
          );
          navigate("/");
        }
        else{
          toast.error("Daha önce avatar seçilmiş. Yönlendirme Yapılacak", toastOptions);
          setTimeout(() => {
            navigate("/");
          }, 3000); 
        }
      })
      .catch(async error =>{
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
        toast.error(`${error.response.data.msg}`, toastOptions);
      })
     }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        try {
          const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          } );
          const buffer = new Buffer(image.data);
          data.push(buffer.toString("base64"));
        } catch (error) {
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
          console.error("Error fetching avatars:", error);
        }
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`;