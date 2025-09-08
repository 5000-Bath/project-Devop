
import React from 'react';
import './Home.css';
import khaoManKai from '../assets/menupic/khao-man-kai.jpg';
import pedPaLo from '../assets/menupic/ped-pa-lo.jpg';
import contactKong from '../assets/contactkong.jpg';
import shinchan from '../assets/shinchan.png';

const menuData = [
  {
    img: khaoManKai,
    name: 'Life Kitchen 金沙海鮮咖哩',
    price: '17.84',
  },
  {
    img: khaoManKai,
    name: 'Life Kitchen 金沙海鮮咖哩',
    price: '17.84',
  },
  {
    img: contactKong,
    name: '米其林二星四人餐',
    price: '11.70',
  },
  {
    img: pedPaLo,
    name: 'Life Kitchen 金沙海鮮咖哩',
    price: '8.99',
  },


  {
    img: khaoManKai,
    name: '霜降牛肉壽喜燒',
    price: '6.48',
  },
  {
    img: khaoManKai,
    name: 'Life Kitchen 金沙海鮮咖哩',
    price: '17.84',
  },
  {
    img: shinchan,
    name: '蜜汁梅花叉燒拼盤',
    price: '17.84',
  },
  {
    img: shinchan,
    name: '蜜汁梅花叉燒拼盤',
    price: '17.84',
  },
  {
    img: khaoManKai,
    name: '蜜汁梅花叉燒拼盤',
    price: '11.70',
  },
  {
    img: contactKong,
    name: '米其林二星四人餐',
    price: '17.84',
  },
    {
    img: pedPaLo,
    name: '帝王蟹肉炒飯',
    price: '14.81',
  },
  {
    img: khaoManKai,
    name: '蜜汁梅花叉燒拼盤',
    price: '17.84',
  },
];

const Home = () => {
  return (
    <div className="home-container">
      <div className="all-menus-header">
        ALL MENUS
      </div>
      <div className="menu-grid">
        {menuData.map((item, index) => (
          <div className="menu-card" key={index}>
            <img src={item.img} alt={item.name} />
            <div className="menu-card-name">{item.name}</div>
            <div className="menu-card-price">${item.price}</div>
            <button className="add-to-cart-button">+1</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
