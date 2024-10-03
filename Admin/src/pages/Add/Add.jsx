import React, { useEffect, useState } from 'react';
import "./Add.css";
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';


import axios from 'axios';

function Add() {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    category: 'Salad',
    price: ''
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', data.price);
    if (image) {
      formData.append('image', image);
    }

    try {
     const response = await axios.post('http://localhost:3000/api/food/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } 
      }
     
    );
    if(response.data.success){   
      setData({
        name: '',
        description: '',
        category: 'Salad',
        price: ''
      });
      setImage(false);
      toast.success(response.data.message); 
    }
    else{ 
      toast.error(response.data.message);     
    }
  
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className='add'>
      <form onSubmit={handleSubmit} className='flex-col'>
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input type="file" id='image' onChange={(e) => setImage(e.target.files[0])} hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input type="text" required name='name' placeholder='Type here' onChange={onChangeHandler} value={data.name} />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea name="description" id="" rows="6" placeholder='Write content here' required onChange={onChangeHandler} value={data.description}></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select name="category" onChange={onChangeHandler} value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input type="number" name='price' required placeholder='$20' onChange={onChangeHandler} value={data.price} />
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
}

export default Add;