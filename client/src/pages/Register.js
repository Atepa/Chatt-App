import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import  ColorPicker  from "../components/ColorPicker";


export default function Register() {
  const navigate = useNavigate();
  
    const [userColor, setUserColor] = useState('#SET-COLOR');
    const [values, setValues] = useState({
      userName: "",
      userMail: "",
      userPassword: "",
      confirmPassword: "",
      userGender: "",
      userColor: "",
      userNickName: "",
    });

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

  const handleColorChange = (color) => {
    setUserColor(color);
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { userPassword, confirmPassword, userName, userMail, userGender, userNickName, userColor } = values;
    if (userPassword !== confirmPassword) {
      toast.error("Password and confirm password should be same.", toastOptions);
      return false;
    } else if (userName.length < 5) {
      toast.error("Username should be greater than 5 characters.", toastOptions);
      return false;
    } else if (userPassword.length < 8) {
      toast.error( "Password should be equal or greater than 8 characters.", toastOptions);
      return false;
    } else if (userMail === "") {
      toast.error("userMail is required.", toastOptions);
      return false;
    } else if (userGender === "") {
      toast.error("userGender is required.", toastOptions);
      return false;
    } else if (userNickName === "") {
      toast.error("userNickName is required.", toastOptions);
      return false;
    }  else if (userColor === "") {
      toast.error("userColor is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { userMail, userPassword, userName, userNickName, userColor, userGender } = values;
      const { data } = await axios.post(registerRoute, {
        userMail:userMail,
        userPassword:userPassword,
        userName:userName,
        userNickName:userNickName,
        userColor:userColor,
        userGender:userGender,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chatimsi</h1>
          </div>
          <input
            type="email"
            placeholder="Email"
            name="userMail"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="userPassword"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Username"
            name="userName"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Nickname"
            name="userNickName"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="#Color"
            name="userColor"
            value={userColor}
            readOnly // Kullanıcı tarafından değiştirilmesini istemiyorsanız
          />
          <h3 style={{ color: userColor }}>Set Color</h3>
          <ColorPicker onColorChange={handleColorChange}/>
          <select name="userGender" onChange={(e) => handleChange(e)}>
            <option value="" disabled selected hidden>Cinsiyet Seçin</option>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
            <option value="no info">Belirtmek İstemem</option>
          </select>
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
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
  margin: 0 auto; /* Formun ortalanması */
  overflow: auto;

  .brand {
    top: 0;
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
    gap: 1.3rem;
    background-color: #00000076;
    border-radius: 5rem;
    padding: 3rem 5rem;
    max-width: 600px; /* Maksimum genişlik sınırlaması */
  }
  h3 {
    color: gray; 
    font-size: 14px; 
    margin-top: -6px; 
    margin-bottom: -20px; 
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
  select {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    cursor: pointer;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
    &:before {
      content: "Placeholder Metni";
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none; 
      color: red;
      transition: all 0.3s ease-out;
    }
  }
  select:label {
    cursor: pointer;
  } 
  
  select option {
    background-color: #131324; /* Arka plan rengi */
    color: #white; /* Yazı rengi */
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