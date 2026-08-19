import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/SparePartsPage.css";

const SparePartsPage = () => {
  const { carModelId } = useParams();
  const navigate = useNavigate();

  const { token } = useAuth();

  const [carModel, setCarModel] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);

  const [quantity, setQuantity] = useState("");
  const [newPartName, setNewPartName] = useState("");
  const [newPartQuantity, setNewPartQuantity] = useState("");
  const [newPartMinPrice, setNewPartMinPrice] = useState("");
  const [newPartMaxPrice, setNewPartMaxPrice] = useState("");

  const [editName, setEditName] = useState("");
  const [editMinPrice, setEditMinPrice] = useState("");
  const [editMaxPrice, setEditMaxPrice] = useState("");



  useEffect(() => {
    fetchParts();
  }, []);



  const fetchParts = async () => {
    try {

      const response = await fetch(
        `http://localhost:5000/api/spare-parts/${carModelId}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      const data = await response.json();

      setCarModel(data.data);

    } catch(error){
      console.error(error);
    }
  };



  const updateQuantity = async () => {

    await fetch(
      `http://localhost:5000/api/spare-parts/${selectedPart.id}/add`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          quantity:Number(quantity)
        })
      }
    );


    setQuantity("");
    setActiveModal(null);
    fetchParts();
  };



  const sellPart = async () => {

    await fetch(
      `http://localhost:5000/api/spare-parts/${selectedPart.id}/sell`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          quantity:Number(quantity)
        })
      }
    );


    setQuantity("");
    setActiveModal(null);
    fetchParts();
  };



  const editPart = async () => {

    await fetch(
      `http://localhost:5000/api/spare-parts/${selectedPart.id}`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          name:editName,
          minPrice:editMinPrice===""?"":Number(editMinPrice),
          maxPrice:editMaxPrice===""?"":Number(editMaxPrice)
        })
      }
    );


    setEditName("");
    setEditMinPrice("");
    setEditMaxPrice("");
    setActiveModal(null);
    fetchParts();
  };



  const deletePart = async(id)=>{

    await fetch(
      `http://localhost:5000/api/spare-parts/${id}`,
      {
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );


    fetchParts();

  };



  const addNewPart = async()=>{

    await fetch(
      "http://localhost:5000/api/spare-parts",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          carModelId,
          name:newPartName,
          quantity:Number(newPartQuantity),
          minPrice:newPartMinPrice===""?undefined:Number(newPartMinPrice),
          maxPrice:newPartMaxPrice===""?undefined:Number(newPartMaxPrice)
        })
      }
    );


    setNewPartName("");
    setNewPartQuantity("");
    setNewPartMinPrice("");
    setNewPartMaxPrice("");
    setActiveModal(null);

    fetchParts();

  };



  if(!carModel){
    return <p>Loading...</p>;
  }



  return (

<div className="spare-parts-page">

<h2>
{carModel.carModel} {carModel.year}
</h2>

<p className="spare-parts-subtitle">
Spare Parts Inventory
</p>



<div className="spare-parts-grid">


{
carModel.spareParts.map(part=>(

<div className="spare-part-box" key={part.id}>


<h3>{part.name}</h3>


<p>
Available:
<strong>
 {part.quantity}
</strong>
</p>


<p className="spare-part-price">
{
part.minPrice==null && part.maxPrice==null
?"Price: TBD"
:part.minPrice===part.maxPrice
?`Price: ${part.minPrice}`
:`Price: ${part.minPrice ?? "?"} - ${part.maxPrice ?? "?"}`
}
</p>


<div className="spare-part-buttons">

<button
className="action-button add-btn"
onClick={()=>{
setSelectedPart(part);
setActiveModal("add");
}}
>
Add
</button>


<button
className="action-button sell-btn"
disabled={part.quantity===0}
onClick={()=>{
setSelectedPart(part);
setActiveModal("sell");
}}
>
Sell
</button>


<button
className="action-button edit-btn"
onClick={()=>{
setSelectedPart(part);
setEditName(part.name);
setEditMinPrice(part.minPrice ?? "");
setEditMaxPrice(part.maxPrice ?? "");
setActiveModal("edit");
}}
>
Edit
</button>


<button
className="action-button delete-btn"
onClick={()=>deletePart(part.id)}
>
Delete
</button>


</div>


</div>


))
}


</div>



<div className="spare-parts-actions">

<button
className="add-new-item-button"
onClick={()=>setActiveModal("new")}
>
+ Add New Spare Part
</button>


<button
className="back-button"
onClick={()=>navigate("/car-models")}
>
← Back
</button>

</div>




{
activeModal &&

<div className="modal-overlay">

<div className="modal-content">


{
activeModal==="new" ?

<>

<h3>Add Spare Part</h3>

<input
placeholder="Part name"
value={newPartName}
onChange={e=>setNewPartName(e.target.value)}
/>


<input
type="number"
placeholder="Quantity"
value={newPartQuantity}
onChange={e=>setNewPartQuantity(e.target.value)}
/>


<input
type="number"
placeholder="Minimum price"
value={newPartMinPrice}
onChange={e=>setNewPartMinPrice(e.target.value)}
/>


<input
type="number"
placeholder="Maximum price"
value={newPartMaxPrice}
onChange={e=>setNewPartMaxPrice(e.target.value)}
/>


</>


:

activeModal==="edit" ?

<>

<h3>Edit Spare Part</h3>

<input
placeholder="Part name"
value={editName}
onChange={e=>setEditName(e.target.value)}
/>


<input
type="number"
placeholder="Minimum price"
value={editMinPrice}
onChange={e=>setEditMinPrice(e.target.value)}
/>


<input
type="number"
placeholder="Maximum price"
value={editMaxPrice}
onChange={e=>setEditMaxPrice(e.target.value)}
/>


</>

:

<>

<h3>
{activeModal==="add"?"Add Quantity":"Sell Quantity"}
</h3>


<input
type="number"
value={quantity}
onChange={e=>setQuantity(e.target.value)}
/>


</>

}


<div className="modal-buttons">

<button
className="add-modal-btn"
onClick={
activeModal==="new"?addNewPart:
activeModal==="edit"?editPart:
activeModal==="add"?updateQuantity:
sellPart
}
>
{
activeModal==="new"?"Add":
activeModal==="edit"?"Save Changes":
"Confirm"
}
</button>

<button
className="cancel-modal-btn"
onClick={()=>setActiveModal(null)}
>
Cancel
</button>

</div>


</div>

</div>

}

</div>

);

};


export default SparePartsPage;