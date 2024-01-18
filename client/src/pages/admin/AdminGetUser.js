import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminRoute, adminUsersRoute } from "../../utils/APIRoutes";
import DataTable from 'react-data-table-component';

export default function Login() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState([]);
    const [filter, setFilter] = useState([]);

    function handleFilter(event){
      const searchTerm = event.target.value.toLowerCase();

      const newData = filter.filter(row => {
        // Mail, createdAt, ve _id alanlarında arama yapılır
        return (
          row._id.toLowerCase().includes(searchTerm) ||
          row.userMail.toLowerCase().includes(searchTerm) ||
          row.userName.toLowerCase().includes(searchTerm) ||
          row.userCreatedAt.toLowerCase().includes(searchTerm) ||
          row.userLastAccessTime.toLowerCase().includes(searchTerm)
        );
      });
      setUsers(newData);
    };

    const handleViewDetails = (row) => {
      navigate(`/users/${row._id}`);
    };

    const navigate = useNavigate();

    const columns = [
        {
            name: 'Id',
            selector: row => row._id,
            sortable: true,
        },
        {
            name: 'Mail',
            selector: row => row.userMail,
            sortable: true,
        },
        {
            name: 'Username',
            selector: row => row.userName,
            sortable: true,
        },
        {
            name: 'CreatedAt',
            selector: row => row.userCreatedAt,
            sortable: true,
        },
        {
            name: 'IsActive',
            selector: row => row.userIsActive,
            cell: row => <span>{row.userIsActive ? 'Active' : 'Inactive'}</span>,
            sortable: true,
        },
        {
            name: 'Last Access',
            selector: row => row.userLastAccessTime,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
              <button onClick={() => handleViewDetails(row)}>Kullanıcı Bilgileri</button>
            ),
        },
    ]

    const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    };

    useEffect(() => {
        if (!localStorage.getItem(process.env.REACT_APP_ADMIN_LOCALHOST_KEY)) {
            navigate("/admin");
        }
    }, [navigate]);

    useEffect(() => {
        console.log('a')
        if (!localStorage.getItem(page)) {
            setPage(1);
        }else{
            setPage(localStorage.getItem(page));
        }   
        localStorage.setItem(
            'page',
            page
        );
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            console.log (localStorage.getItem(page));
            console.log(page);
              const  token  = await JSON.parse(
                localStorage.getItem('token')
              );
              const axiosInstance = axios.create({
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token,
                }
              });
              const { data } = await axiosInstance.get(`${adminUsersRoute}/0`); 
              setUsers(data.users);
              setFilter(data.users);
          }
    
        fetchData();
      }, [navigate]);
     
    return (
      <FormContainer>
        <div className = 'FormContainer'>
          <div className="text-find">
            <input type = "text" onChange={handleFilter} placeholder="Arama yapın..."/>
          </div>
          <DataTable 
            columns = {columns} 
            data = {users} 
            fixedHeader 
            pagination
          />
        </div>
      </FormContainer>
        
      );
};


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: #131324;
  .text-find {
    width: 100vh;
    padding: 0.5rem;
    justify-content: flex-end;
    display: flex;
    align-self: flex-end; 
  }
  .FormContainer {
    align-items: flex-end;
    justify-content: flex-start;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100vh; /* Sayfa yüksekliği ekran yüksekliği kadar olacak */
    width: 100vw; /* Sayfa genişliği ekran genişliği kadar olacak */
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.5rem;
    color: white;
    background-color: black;
    width: 50%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #aeefbc;
    padding: 0.5rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    &:hover {
      background-color: #4eefff;
    }
  }
  span {
    color: black;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;