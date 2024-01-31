import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";


export default function  FileInput()  {
  const [file, setFile] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const maxSizeInMB = 20;
  const maxDurationInSeconds = 30;
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  function handleFileChange (e) {
    setFile(e.target.files[0]);
    console.log(file);

    console.log(e.target.files[0].size);
    console.log(e.target.files[0].type);
    console.log(maxSizeInMB * 1024 * 1024);

    if(!e.target.files[0].type.includes("video") && !e.target.files[0].type.includes("image") ){
      setErrorMessage(`Sadece video ve fotoğraf kabul edilir.`)
      toast.error(`Sadece video ve fotoğraf kabul edilir.`, toastOptions);
      return false; 
    }
    // Dosya boyutunu kontrol et
    if (maxSizeInMB && e.target.files[0].size > maxSizeInMB * 1024 * 1024) {
      setErrorMessage(`Dosya boyutu ${maxSizeInMB}MB'dan büyük olamaz.`)
      toast.error(`Dosya boyutu ${maxSizeInMB}MB'dan büyük olamaz.`, toastOptions);
      return false;   
    } else {
      setErrorMessage("");
    } 
    

    // Dosya süresini kontrol et (Bu örnek sadece video dosyaları içindir)
    if (maxDurationInSeconds && e.target.files[0].type.includes("video")) {
      const video = document.createElement("video");
        video.preload = "metadata";
      console.log(video.duration);
      console.log(video);

      video.onloadedmetadata = () => {
        console.log(video.duration);
        console.log(video);

        if (video.duration > maxDurationInSeconds) {
          setErrorMessage(`Dosya süresi ${maxDurationInSeconds} saniyeden uzun olamaz.`)
          toast.error(`Dosya süresi ${maxDurationInSeconds} saniyeden uzun olamaz.`, toastOptions);
          return false;
        } else {
          setErrorMessage("");
        } 
      };
      video.src = URL.createObjectURL(e.target.files[0]);
    }

  };
  function handleUpload(event) {
    event.preventDefault();

    console.log(errorMessage);
    if( errorMessage != ""){
      toast.error(errorMessage, toastOptions);
      return false;
    }
    // const formData = new FormData();
    // formData.append('file',file);
    // axios
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/jpeg, image/png, video/mp4"
            onChange={handleFileChange}
          />
        <button> upload </button>
        </form>
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
