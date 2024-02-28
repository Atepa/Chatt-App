import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserInfo, putUserInfo, putUserPasswordInfo } from "../utils/APIRoutes";
import  ColorPicker  from "../components/ColorPicker";


export default function InfoUser() {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState("");
  const [userNickName, setuserNickName] = useState("");
  const [userMail, setUserMail] = useState("");
  const [userCreatedAt, setUserCreatedAt] = useState("");
  const [userLastAccessTime, setUserLastAccessTime] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userColor, setUserColor] = useState('#SET-COLOR'); 
  const [currentUserId, setCurrentUserId] = useState(undefined); 
  const [token, setToken] = useState(undefined); 

  const [standartValues, setStandartValues] = useState({
    userName: "",
    userNickName: "",
    userGender: "",
    userColor: "",
  });

  const [customValues, setCustomValues] = useState({
    currentPass: "",
    newPass: "",
    confirmPass: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const fetchData = () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      }	
    }
    fetchData();
  }, [navigate]);

	useEffect(() =>{
		const fetchData = async () => {
			const  users = JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			);
      setCurrentUserId(users._id)
      setToken(JSON.parse(
        localStorage.getItem('token')
      ));		
      const tkn = JSON.parse(
        localStorage.getItem('token')
      );			

      await axios.get(`${getUserInfo}/${users._id}` ,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tkn,
        }
      })
			.then(res => { 
				if (res.data.status === false) {
					toast.error(res.data.msg, toastOptions);
				}
				else {
					localStorage.setItem(
						process.env.REACT_APP_LOCALHOST_KEY,
						JSON.stringify(res.data.response[0])
					);
					const userData = res.data.response[0];
					setUserName(userData.userName);
					setuserNickName(userData.userNickName);
					setUserMail(userData.userMail);
					setUserGender(userData.userGender);
					setUserCreatedAt(userData.userCreatedAt);
					setUserLastAccessTime(userData.userLastAccessTime);
					setUserColor(userData.userColor)
          setStandartValues({
            ...standartValues,
            userName: userData.userName,
            userNickName: userData.userNickName,
            userGender: userData.userGender,
            userColor: userData.userColor
          });
				}
			})
			.catch(error =>{
				toast.error(error.message, toastOptions);
			})
		}
		fetchData();
	},[ setStandartValues, setUserName, setuserNickName, setUserMail,setUserGender,setUserGender,setUserCreatedAt, setUserLastAccessTime, setUserColor, setCurrentUserId]);

  const handleColorChange = (color) => {
    standartValues.userColor = color;
    setUserColor(color);
  };

  const handleChangeStandartData = (event) => {
    setStandartValues({ ...standartValues, [event.target.name]: event.target.value });
  };

  const handleChangeCustomData = (event) => {
    setCustomValues({ ...customValues, [event.target.name]: event.target.value });
  };

  const handleValidationStandartData = () => {
    const { userName, userGender, userNickName, userColor } = standartValues;
      if (userName === "" || userName.length < 3 || userName.length >= 15 ) {
        toast.error(`Username should be between 3 and 15 characters.`, toastOptions);
        return false;
      } else if (userNickName === "" || userNickName.length<3 || userNickName.length >= 15) {
        toast.error("Nickname should be between 3 and 15 characters.", toastOptions);
        return false;
      } else if (userGender === "") {
        toast.error("Gender is required.", toastOptions);
        return false;
      } else if (userColor === "") {
        toast.error("Color is required.", toastOptions);
        return false;
      }
      return true;
  };

  const handleValidationCustomData = () => {
    const { currentPass, newPass, confirmPass } = customValues;
      if (currentPass === "" || currentPass.length < 8 ) {
          toast.error("Current Password should be equal or greater than 8 characters...", toastOptions);
          return false;
      } else if (newPass === ""|| newPass.length<8) {
        toast.error("New Password should be equal or greater than 8 characters...", toastOptions);
        return false;
      } else if (confirmPass === ""|| confirmPass <8 ) {
        toast.error("Confirm Password should be equal or greater than 8 characters...", toastOptions);
        return false;
      }
      else if (confirmPass !== newPass ) {
        toast.error("Confirm Password and newPassword password should be same", toastOptions);
        return false;
      }
      return true;
  };

  const handleSubmitStandartData = async (event) => {
    event.preventDefault();
    if (handleValidationStandartData()) {		
      await axios.put(`${putUserInfo}/${currentUserId}`, {
        standartValues,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(res => {
        if(res.data.status === true){
          toast.success("Kayıt Başarılı", toastOptions);
          setTimeout(() => {
            window.location.reload();
          }, 3000); 
        }
        else{
          toast.error(`${res.data.msg}`, toastOptions);
        }
      })
      .catch(error => {
        toast.error(`${error.message}`, toastOptions);
      })
    }
  };

  const handleSubmitCustomData = async (event) => {
    event.preventDefault();
    if (handleValidationCustomData()) {
      await axios.put(`${putUserPasswordInfo}/${currentUserId}`,{
        oldUserPassword: customValues.currentPass,
        newUserPassword: customValues.newPass,
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
      .then(res => {
        if(res.data.status === true){
          toast.success("Kayıt Başarılı", toastOptions);
          setTimeout(() => {
            window.location.reload();
          }, 3000); 
        }
        else{
          toast.error(`${res.data.msg}`, toastOptions);
        }
      })
      .catch(error => {
        toast.error(`${error.message}`, toastOptions);
      })
    }
  };

  return (
    <>
      <FormContainer>
        <div className="forms-container">
        <form action="" onSubmit={(event) => handleSubmitStandartData(event)}>
            <div className="brand">
                <img src={Logo} alt="logo" />
                <h1>Chatimsi</h1>
            </div>
            <h3>Username</h3>
            <input
                type="text"
                placeholder="Username"
                name="userName"
								defaultValue={userName}
                onChange={(e) => handleChangeStandartData(e)}
            />
            <h3>Nickname</h3>
            <input
                type="text"
                placeholder="Nickname"
                name="userNickName"
								defaultValue={userNickName}
                onChange={(e) => handleChangeStandartData(e)}
            />
            <h3>Register Date</h3>
            <input
                type="text"
                placeholder="userCreatedAt"
                name="userCreatedAt"
								value={userCreatedAt}
                readOnly 
            />
            <h3>Last Access Date</h3>
            <input
                type="text"
                placeholder="userLastAccessTime"
                name="userLastAccessTime"
								value={userLastAccessTime}
                readOnly 
            />
            <input
                type="text"
                placeholder="#Color"
                name="userColor"
                value={userColor}
                readOnly
            />
            <h3 style={{ color: userColor }}>Set Color</h3>
            <ColorPicker onColorChange={handleColorChange}/>
						<h3>Gender</h3>
            <select name="userGender" value={ standartValues.userGender } onChange={ (e) => handleChangeStandartData(e) }>
                <option value="" disabled selected hidden>Cinsiyet Seçin</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
                <option value="no info">Belirtmek İstemiyorum</option>
            </select>
            <button type="submit">Save</button>
            <span>
                <Link to="/">Go Chat</Link>
            </span>
          </form>
          <form action="" onSubmit={(event) => handleSubmitCustomData(event)}>
						<div className="brand">
								<img src={Logo} alt="logo" />
								<h1>Chatimsi</h1>
						</div>
            <h3>E-mail</h3>
						<input
						type="email"
						placeholder="Email"
						name="userMail"
						value={userMail}
						readOnly 
						/>
            <h3>Current Password</h3>
						<input
								type="password"
								placeholder="Current Password"
								name="currentPass"
								onChange={(e) => handleChangeCustomData(e)}
                autocomplete="new-password"
						/>
            <h3>New Password</h3>
						<input
								type="password"
								placeholder="New Password"
								name="newPass"
								onChange={(e) => handleChangeCustomData(e)}
                autocomplete="new-password"
						/>
            <h3>Confirm Password</h3>
						<input
								type="password"
								placeholder="Confirm Password"
								name="confirmPass"
								onChange={(e) => handleChangeCustomData(e)}
                autocomplete="new-password" 
						/>
						<button type="submit">Save New Password</button>
						<span>
								<Link to="/">Go Chat</Link>
						</span>
          </form>
        </div>
      </FormContainer>
    	<ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content:  space-between;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
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
  .forms-container {
    margin-top: 4rem;
    margin-bottom: 3rem;
    gap: 1rem;
    display: flex;
    justify-content: space-between; /* Formları aralarında boşluk bırakarak yan yana hizalar */
    width: 100%;
    max-width: 900px; /* İki formun toplam maksimum genişliği */
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