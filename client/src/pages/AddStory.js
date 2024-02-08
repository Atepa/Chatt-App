import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { postStory } from "../utils/APIRoutes";


export default function  FileInput()  {
  const navigate = useNavigate();
  const [file , setFile] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);

  const fileInputRef = React.useRef(null);
  const maxSizeInMB = 20;
  const maxDurationInSeconds = 30;
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

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

  function handleFileChange (e) {
    setFile(e.target.files[0]);

    if(!e.target.files[0].type.includes("video") && !e.target.files[0].type.includes("image") ){
      setErrorMessage(`Sadece video ve fotoğraf kabul edilir...`)
      toast.error(`Sadece video ve fotoğraf kabul edilir.`, toastOptions);
      setErrorMessage("");
      setVideoPreview(null);
      setImagePreview(null);
      fileInputRef.current.value = "";
      return false; 
    }
    if (maxSizeInMB && e.target.files[0].size > maxSizeInMB * 1024 * 1024) {
      setErrorMessage(`Dosya boyutu ${maxSizeInMB}MB'dan büyük olamaz.`)
      toast.error(`Dosya boyutu ${maxSizeInMB}MB'dan büyük olamaz`, toastOptions);
      setErrorMessage("");
      setVideoPreview(null);
      setImagePreview(null);
      fileInputRef.current.value = "";
      return false;   
    } else {
      setErrorMessage("");
    } 
    if (e.target.files[0].type.includes("image")) {
      setVideoDuration(15000)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setVideoPreview(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }

    if (maxDurationInSeconds && e.target.files[0].type.includes("video")) {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        setVideoDuration(video.duration)
        if (video.duration > maxDurationInSeconds) {
          setErrorMessage(`Dosya süresi ${maxDurationInSeconds} saniyeden uzun olamaz.`)
          toast.error(`Dosya süresi ${maxDurationInSeconds} saniyeden uzun olamaz.`, toastOptions);
          setErrorMessage("");
          setVideoPreview(null);
          setImagePreview(null);
          fileInputRef.current.value = "";
          return false;
        } else {
          setErrorMessage("");
        } 
      };
      video.src = URL.createObjectURL(e.target.files[0]);
      setVideoPreview(video.src);
      setImagePreview(null);
    }

  };
  function handleUpload(event) {

    event.preventDefault();
    if( errorMessage != ""){
      toast.error(errorMessage, toastOptions);
      setErrorMessage("");
      setVideoPreview(null);
      setImagePreview(null);
      fileInputRef.current.value = "";
      return false;
    }
    // else if(errorMessage == "") {
    //   toast.error("Bir video veya fotoğraf seçilmeli", toastOptions);
    //   setVideoPreview(null);
    //   setImagePreview(null);
    //   fileInputRef.current.value = "";
    //   return false;
    // } 
    const formData = new FormData();
    formData.append('file',file);
    formData.append('duration', videoDuration);
    formData.append('senderUserNickName', currentUser.userNickName);
    formData.append('senderUserAvatarImage', currentUser.avatarImage);

    axios.post( `${postStory}/${currentUser._id}` ,formData)
    .then(res => {  
      toast.success("Kayıt Başarılı -- Yönlendirme yapılıyor...", toastOptions);
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        navigate("/story");
      }, 3000); 
    })
    .catch(err =>{
      toast.error(`Kayıt Başarısız error-> ${err.errorMessage}`, toastOptions);

    })
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/jpeg, image/png, video/mp4"
            onChange={handleFileChange}
            ref={fileInputRef} // Add this line to get a reference to the input element
          />
          {imagePreview && <img controls width ="300" src={imagePreview} alt="Preview" />}
          {videoPreview && <video controls width="300" src={videoPreview} />}
        <button> upload </button>
        </form>
      <span>
        <Link to="/">-Go Chat-</Link>{"     "}
        <span style={{ marginRight: "7rem" }}></span>
        <Link to="/story">Go Story Page</Link>
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
  overflow: auto;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
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
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;