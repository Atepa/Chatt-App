import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link, useParams } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RefreshPassword, forgotPassword } from "../utils/APIRoutes";

export default function ForgotPassword() {

  const navigate = useNavigate();
  const { userId } = useParams();

  const [values, setValues] = useState({ newPassword: "", confirmPassword: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    console.log(values);
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { newPassword, confirmPassword } = values;
    if (newPassword === "" || newPassword.lenght < 8) {
      toast.error("Password should be equal or greater than 8 characters.", toastOptions);
      return false;
    } 
    if (newPassword !== confirmPassword) {
        toast.error("Password and confirm password should be same.", toastOptions);
        return false;
    } 
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
        const { newPassword } = values;
        await axios.post(`${RefreshPassword}`, { 
            id: userId,
            password: newPassword
        })
        .then( res => {
            if(res.status === 200){
                setTimeout(() => {
                    toast.success(`Şifre Başarıyla Değiştirildi`,toastOptions);
                    // link
                }, 4000);
            } else{
                toast.success(`error -> ${res.data.msg}`,toastOptions);
            }
        })
        .catch ( error => {
          if(error.response?.status === 404)
          {
            toast.error(`Bu Emaile Sahip Bir Kullanıcı Bulunamadı`,toastOptions);
          }
          else{
            toast.error(`Bir Şeyler Ters Gitti`,toastOptions);
          }
        })
    }
  };
  
  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="userMail"
            name="userMail"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <button type="submit">Mail Gönder</button>
          <span>
            <Link to="/login">Login Page</Link>
          </span>
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
  overflow-y: auto; /* Yatay kaydırma çubuğunu ekler */

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