import React, { useState } from "react";

function PlantCard({ plant, onDeletePlant, onUpdatePlant }) {
  const [inStock, setInStock] = useState(plant.inStock ?? true);
  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(plant.price);

  function handleStockToggle() {
    const updatedInStock = !inStock;
    setInStock(updatedInStock);

    fetch(`http://localhost:6001/plants/${plant.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inStock: updatedInStock }),
    }).catch((error) => alert("Failed to update stock status."));
  }

  function handlePriceUpdate() {
    fetch(`http://localhost:6001/plants/${plant.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: parseFloat(newPrice) }),
    })
      .then((response) => response.json())
      .then((updatedPlant) => {
        onUpdatePlant(updatedPlant);
        setEditingPrice(false);
      })
      .catch((error) => alert("Failed to update price."));
  }

  function handleDelete() {
    fetch(`http://localhost:6001/plants/${plant.id}`, {
      method: "DELETE",
    })
      .then(() => onDeletePlant(plant.id))
      .catch((error) => alert("Failed to delete plant."));
  }

  return (
    <li className="card">
      <img src={plant.image} alt={plant.name} />
      <h4>{plant.name}</h4>
      {editingPrice ? (
        <div>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            step="0.01"
          />
          <button onClick={handlePriceUpdate}>Save</button>
        </div>
      ) : (
        <p onDoubleClick={() => setEditingPrice(true)}>Price: ${plant.price}</p>
      )}
      <button className={inStock ? "primary" : ""} onClick={handleStockToggle}>
        {inStock ? "In Stock" : "Out of Stock"}
      </button>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default PlantCard;
