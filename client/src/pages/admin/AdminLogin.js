import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminRoute } from "../../utils/APIRoutes";

export default function Login() {

    const navigate = useNavigate();
    const [values, setValues] = useState({ userMail: "", userPassword: "" });
    const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    };

    useEffect(() => {
      console.log("asdasd");

        if (localStorage.getItem(process.env.REACT_APP_ADMIN_LOCALHOST_KEY)) {
          console.log("asdasd");
          navigate("/admin/panel/0");
        }
    }, [navigate]);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        const { userMail, userPassword } = values;
        if (userMail === "") {
          toast.error("Email and Password is required.", toastOptions);
          return false;
        } else if (userPassword === "") {
          toast.error("Email and Password is required.", toastOptions);
          return false;
        }
        console.log(userMail, userPassword);
        return true;
      };

      //
      const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
          const { userMail, userPassword } = values;
          const response = await axios.post(adminRoute, {
            userMail,
            userPassword,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.status === false) {
            toast.error(response.data.msg, toastOptions);
          }
          if (response.data.status === true) {
            const token = response.data.X_Access_Admin_Token; 
            axios.defaults.headers.common["Authorization"] = token;
    
            console.log(response.headers.get['To-ken']);
            localStorage.setItem(
              process.env.REACT_APP_ADMIN_LOCALHOST_KEY,
              JSON.stringify(response.data.user)
            );
          navigate("/admin/panel");
          }
        }
      };

    return (
        <>
        <FormContainer>
            <form action="" onSubmit={(event) => handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} alt="logo" />
                <h1>Admin Panel</h1>
            </div>
            <input
                type="text"
                placeholder="userMail"
                name="userMail"
                onChange={(e) => handleChange(e)}
                min="3"
            />
            <input
                type="password"
                placeholder="userPassword"
                name="userPassword"
                onChange={(e) => handleChange(e)}
            />
            <button type="submit">Log In</button>
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