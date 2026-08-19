import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";

export const StockContext = createContext();


export const StockProvider = ({ children }) => {

  const { token } = useAuth();


  const getCarModels = async () => {

    const response = await fetch(
      "https://tmsimport-backend.vercel.app/api/car-models",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    return data.data;
  };



  const getSpareParts = async (carModelId) => {

    const response = await fetch(
      `https://tmsimport-backend.vercel.app/api/spare-parts/${carModelId}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    return data.data;
  };



  const addSparePartQuantity = async (
    sparePartId,
    quantity
  ) => {

    const response = await fetch(
      `https://tmsimport-backend.vercel.app/api/spare-parts/${sparePartId}/add`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          quantity
        })
      }
    );


    return response.json();

  };



  const sellSparePartQuantity = async (
    sparePartId,
    quantity
  ) => {

    const response = await fetch(
      `https://tmsimport-backend.vercel.app/api/spare-parts/${sparePartId}/sell`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          quantity
        })
      }
    );


    return response.json();

  };



  const updateSparePart = async (
    sparePartId,
    { name, minPrice, maxPrice }
  ) => {

    const response = await fetch(
      `https://tmsimport-backend.vercel.app/api/spare-parts/${sparePartId}`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          name,
          minPrice,
          maxPrice
        })
      }
    );


    return response.json();

  };



  const deleteSparePart = async (sparePartId)=>{

    const response = await fetch(
      `https://tmsimport-backend.vercel.app/api/spare-parts/${sparePartId}`,
      {
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );


    return response.json();

  };



  const addNewSparePart = async (
    carModelId,
    name,
    quantity
  )=>{


    const response = await fetch(
      "https://tmsimport-backend.vercel.app/api/spare-parts",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          carModelId,
          name,
          quantity
        })
      }
    );


    return response.json();

  };



  const getHistory = async ()=>{

    const response = await fetch(
      "https://tmsimport-backend.vercel.app/api/history",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );


    const data = await response.json();

    return data.history;

  };



  return (
    <StockContext.Provider
      value={{
        getCarModels,
        getSpareParts,
        addSparePartQuantity,
        sellSparePartQuantity,
        updateSparePart,
        deleteSparePart,
        addNewSparePart,
        getHistory,
      }}
    >
      {children}
    </StockContext.Provider>
  );

};
