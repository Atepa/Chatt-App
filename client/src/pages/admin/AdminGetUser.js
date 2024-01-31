import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { adminUserRoute } from "../../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { loginRoute } from "../../utils/APIRoutes";
import styled from "styled-components";


export default function UserDetail () {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [locationCountry, setlocationCountry] = useState("");
  const [locationPostCode, setlocationPostCode] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const navigate = useNavigate();
  const [values, setValues] = useState({ userMail: "", userPassword: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [changesSaved, setChangesSaved] = useState(false);

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
    return true;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { userMail, userPassword } = values;
      const response = await axios.post(loginRoute, {
        userMail,
        userPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
      console.log(data.X_Access_Token);
  
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        const token = data.X_Access_Token; // 'Authorization' yerine 'authorization' olabilir
  
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user),
        );
        localStorage.setItem(
          "token",
          JSON.stringify(token),
        );
      navigate("/");
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {data} = await axios.get(`${adminUserRoute}/${userId}`);
        setUserData(data.users);
        setlocationCountry(data.users.userLocation.locationCountry);
        setlocationPostCode(data.users.userLocation.locationPostCode);
        setLocationAddress(data.users.userLocation.locationAddress);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      console.log(setlocationPostCode);
    };
    
    fetchUserData();
  }, [userId]);

  const handleSaveChanges = () => {
 
    setChangesSaved(true);
  };

  const handleDeleteChatData = () => {
    // Sohbet verilerini silme işlemleri buraya gelecek
    // Örneğin, bir API çağrısı yapılabilir
    // Uyarı: Bu işlem geri alınamaz olabilir, dikkatli kullanılmalıdır
  };

  return (
    <>
      < Container>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSaveChanges(event)}>
        <span>
            Id   --   {userData._id}
        </span>
          <input
            type="text"
            placeholder="userMail"
            name="userMail"
            onChange={(e) => handleChange(e)}
            value = {userData.userMail} 
            min="3"
          />
          <input
            type="text"
            placeholder="userNickName"
            name="userMail"
            onChange={(e) => handleChange(e)}
            value = {userData.userNickName} 
            min="3"
          />
            <input
            type="text"
            placeholder="userName"
            name="userMail"
            onChange={(e) => handleChange(e)}
            value = {userData.userName} 
            min="3"
          />
       
           <input
            type="text"
            placeholder="locationCountry"
            name="userMail"
            onChange={(e) => handleChange(e)}
            value = {locationCountry} 
            min="3"
          />
               <input
            type="text"
            placeholder="locationPostCode"
            name="userMail"
            onChange={(e) => handleChange(e)}
            value = {locationPostCode} 
            min="3"
          />
           <input
            type="text"
            placeholder="locationAddress"
            name="userMail"
            onChange={(e) => handleChange(e)}
            value = {locationAddress} 
            min="3"
          />
          <input
            type="text"
            placeholder="userColor"
            name="userMail"
            onChange={(e) => handleChange(e)}
            value = {userData.userColor} 
            min="3"
          />
          <span>
            Pasif Tarihi   --   {userData.userDeActivateTime ? userData.userDeActivateTime : "Kullanıcı Aktif"}
          </span>
          <input
            type="text"
            placeholder="userGender"
            name="userMail"
            onChange={(e) => handleChange(e)}
            value = {userData.userGender} 
            min="3"
          />
          <span>
            Son Erişim Tarihi   --   {userData.userLastAccessTime}
          </span>
          <span>
            Kayıt Tarihi   --   {userData.userCreatedAt}
          </span>
          <span>
            Kullanıcı Aktif   --   {userData.userIsActive ? "  Evet" : "  Hayır"}
          </span>
          <span>
            Kullanıcı Admin   --   {userData.userIsAdmin ? "  Evet" : "  Hayır"}
          </span>
  
          <button type="submit">Kaydet</button>
        </form>
      </FormContainer>
      <ToastContainer />
    </Container>
  </>
);

  // return (
  //   <div>
  //     <h2>Kullanıcı Detayları</h2>
  //     <p>ID: {userData._id}</p>
  //     <p>Mail: {userData.userMail}</p>
  //     <p>UserNickname: {userData.userNickName}</p>
  //     <p>Username: {userData.userName}</p>
  //     <p>Son Erişim Tarihi: {userData.userLastAccessTime}</p>
  //     <p>Üyelik Tarihi: {userData.userCreatedAt}</p>
  //     <p>Adres - Ülke: {locationCountry}</p> 
  //     <p>Adres - Posta Kodu: {locationPostCode}</p>
  //     <p>Adres - Adres: {locationAddress}</p>   
  //     <p>Cinsiyet: {userData.userGender}</p>
  //     <p>Renk: {userData.userColor}</p>
  //     <p>Pasif Tarihi: {userData.userDeActivateTime ? userData.userDeActivateTime : "Aktif"}</p>
  //     <p>Aktif: {userData.userIsActive ? "Evet" : "Hayır"}</p>
  //     <p>Admin: {userData.userIsAdmin ? "Evet" : "Hayır"}</p>

  //     <button onClick={handleSaveChanges} disabled={changesSaved}>
  //       Değişiklikleri Kaydet
  //     </button>
  //     <button onClick={handleDeleteChatData}>
  //       Sohbet Verilerini Sil
  //     </button>
  //   </div>
  // );
};

// return (
//   <>
//     < Container>
//     <FormContainer>
//       <form action="" onSubmit={(event) => handleSubmit(event)}>
//       <span>
//           Id: `${userData._id}`
//       </span>
//         <input
//           type="text"
//           placeholder="userMail"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           value = {userData._id} 
//           min="3"
//         />
//         <input
//           type="text"
//           placeholder="userNickName"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//           <input
//           type="text"
//           placeholder="userName"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//         <span>
//           Üye Son Erişim Tarihi: `${userData.userLastAccessTime}`
//         </span>
//         <span>
//           Üye Kayıt Tarihi: `${userData.userCreatedAt}`
//         </span>
//          <input
//           type="text"
//           placeholder="locationCountry"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//              <input
//           type="text"
//           placeholder="locationPostCode"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//          <input
//           type="text"
//           placeholder="locationAddress"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//         <input
//           type="text"
//           placeholder="userGender"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//         <input
//           type="text"
//           placeholder="userColor"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//         <span>
//           Pasif Tarihi: `${userData.userDeActivateTime ? userData.userDeActivateTime : "Aktif"}`
//         </span>
//         <input
//           type="text"
//           placeholder="userGender"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//         <span>
//           Kullanıcı Aktif : `${userData.userIsActive ? "Evet" : "Hayır"}`
//         </span>
//         <span>
//           Kullanıcı Admin: `${userData.userIsAdmin ? "Evet" : "Hayır"}`
//         </span>

//         <button type="submit">Log In</button>
//         <span>
//           Don't have an account ? <Link to="/register">Create One.</Link>
//         </span>
//       </form>
//     </FormContainer>
//     {/* <FormContainer1>
//       <form action="" onSubmit={(event) => handleSubmit(event)}>
//         <div className="brand">
//           <img src={Logo} alt="logo" />
//           <h1>snappy</h1>
//         </div>
//         <input
//           type="text"
//           placeholder="userMail"
//           name="userMail"
//           onChange={(e) => handleChange(e)}
//           min="3"
//         />
//         <input
//           type="password"
//           placeholder="userPassword"
//           name="userPassword"
//           onChange={(e) => handleChange(e)}
//         />
//         <button type="submit">Log In</button>
//         <span>
//           Don't have an account ? <Link to="/register">Create One.</Link>
//         </span>
//       </form>
//     </FormContainer1> */}
//     <ToastContainer />
//     </Container>
//   </>
// );

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
background-color: #131324;
align-items: center; /* İçeriği dikeyde ortalar */
justify-content: center; /* İçeriği yatayda ortalar */
`;

const FormContainer = styled.div`
margin-right: 1rem;
margin-bottom: 1rem;
margin-top: 1rem;


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
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #00000076;
  border-radius: 2rem;
  padding: 10rem;
}
input {
  background-color: transparent;
  padding: 0.8rem;
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
.input-group {
  display: flex;
}

.input-group input {
  margin-right: 10px; 
}

button {
  margin-top: 20px; /* veya başka bir değer */
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
  background-color: purple;
  display: flex;
  align-items: center;
  height: 2.2rem;
  border: 0.1rem solid #4e0eff;
  border-radius: 0.4rem;
  margin-bottom: 5px; /* veya başka bir değer */
  margin-top: 5px; /* veya başka bir değer */
  color: white;
  text-transform: uppercase;  
}
`;
// const FormContainer1 = styled.div`
// width: 40vw;
// margin-left: 1rem;
//   display: flex;
// flex-direction: column;
// justify-content: center;
// gap: 1rem;
// align-items: center;
// background-color: #131324;
// .brand {
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   justify-content: center;
//   img {
//     height: 5rem;
//   }
//   h1 {
//     color: white;
//     text-transform: uppercase;
//   }
// }

// form {
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;
//   background-color: #00000076;
//   border-radius: 2rem;
//   padding: 5rem;
// }
// input {
//   background-color: transparent;
//   padding: 1rem;
//   border: 0.1rem solid #4e0eff;
//   border-radius: 0.4rem;
//   color: white;
//   width: 100%;
//   font-size: 1rem;
//   &:focus {
//     border: 0.1rem solid #997af0;
//     outline: none;
//   }
// }
// .input-group {
//   display: flex;
// }

// .input-group input {
//   margin-right: 10px; /* İstenilen aralığı ayarlayabilirsiniz */
// }
// button {
//   background-color: #4e0eff;
//   color: white;
//   padding: 1rem 2rem;
//   border: none;
//   font-weight: bold;
//   cursor: pointer;
//   border-radius: 0.4rem;
//   font-size: 1rem;
//   text-transform: uppercase;
//   &:hover {
//     background-color: #4e0eff;
//   }
// }
// span {
//   color: white;
//   text-transform: uppercase;
//   a {
//     color: #4e0eff;
//     text-decoration: none;
//     font-weight: bold;
//   }
// }
// `;