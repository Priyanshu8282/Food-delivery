import React, { useState, useEffect } from 'react';
import "./List.css";
import axios from 'axios';
import { toast } from 'react-toastify';

function List() {
  const [list, setList] = useState([]);
  const url="http://localhost:3000"

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log('API Response:', response.data);

      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          setList(response.data.data);
      
        } else {
          console.error('Data is not an array:', response.data.data);
          toast.error('Data format is incorrect.');
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while fetching the list.');
      console.error('Fetch error:', error);
    }
  };

  const removeFood = async (foodId) => {
  const response=await axios.post(`${url}/api/food/remove`,{id:foodId})
  await fetchList();
  if (response.data.success) {
    toast.success(response.data.message)

    
  }
  else{ 
    toast.error("error")
  }

  };

  useEffect(() => {
    fetchList();
  }, []);



  return (
    <div className='list add flex-col'>
      <p>All Data List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {Array.isArray(list) && list.length > 0 ? (
          list.map((items, index) => (
            <div className="list-table-format" key={index}>
              <img src={`${url}/images/${items.image}`} alt="food" />
              <p>{items.name}</p>
              <p>{items.category}</p>
              <p>{items.price}</p>
              <p className='curser' onClick={()=>removeFood(items._id)}>X</p>
            </div>
          ))
        ) : (
          <p>No items available</p>
        )}
      </div>
    </div>
  );
}

export default List;
