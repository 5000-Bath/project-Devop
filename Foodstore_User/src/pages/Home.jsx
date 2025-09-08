import React, { useContext } from 'react';
import './Home.css';
import khaoManKai from '../assets/menupic/khao-man-kai.jpg';
import pedPaLo from '../assets/menupic/ped-pa-lo.jpg';
import contactKong from '../assets/contactkong.jpg';
import shinchan from '../assets/shinchan.png';
import { CartContext } from '../context/CartContext';

const menuData = [
  {
    img: khaoManKai,
    name: 'Life Kitchen 金沙海鮮咖哩',
    price: 18,
  },
  {
    img: khaoManKai,
    name: 'Life Kitchen 金沙海鮮咖哩',
    price: 18,
  },
  {
    img: contactKong,
    name: '米其林二星四人餐',
    price: 12,
  },
  {
    img: pedPaLo,
    name: 'Life Kitchen 金沙海鮮咖哩',
    price: 9,
  },
  {
    img: khaoManKai,
    name: '霜降牛肉壽喜燒',
    price: 7,
  },
  {
    img: khaoManKai,
    name: 'Life Kitchen 金沙海鮮咖哩',
    price: 18,
  },
  {
    img: shinchan,
    name: '蜜汁梅花叉燒拼盤',
    price: 18,
  },
  {
    img: shinchan,
    name: '蜜汁梅花叉燒拼盤',
    price: 18,
  },
  {
    img: khaoManKai,
    name: '蜜汁梅花叉燒拼盤',
    price: 12,
  },
  {
    img: contactKong,
    name: '米其林二星四人餐',
    price: 18,
  },
    {
    img: pedPaLo,
    name: '帝王蟹肉炒飯',
    price: 15,
  },
  {
    img: khaoManKai,
    name: '蜜汁梅花叉燒拼盤',
    price: 18,
  },
];

const Home = () => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="home-container">
      <div className="all-menus-header">
        <h1>ALL MENUS</h1>
      </div>
      <div className="menu-grid-container">
        <div className="menu-grid">
        {menuData.map((item, index) => (
          <div className="menu-card" key={index}>
            <img src={item.img} alt={item.name} />
            <div className="menu-card-name">{item.name}</div>
            <div className="menu-card-price">{item.price} THB</div>
            <button className="add-to-cart-button" onClick={() => addToCart(item)}>+1</button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Home;