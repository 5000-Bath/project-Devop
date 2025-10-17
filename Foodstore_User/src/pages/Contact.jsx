import React from 'react';
import './Contact.css';

// แทนที่ด้วย path จริงของรูปแต่ละคน
import img1 from '../assets/team/member1.jpg';
import img2 from '../assets/team/member2.png';
import img3 from '../assets/team/member3.png';
import img4 from '../assets/team/member4.jpeg';
import img5 from '../assets/team/member5.jpeg';
import img6 from '../assets/team/member6.jpg';

// ข้อมูลสมาชิกทีม — แก้ไขตรงนี้ได้เลย!
const teamMembers = [
  {
    id: 1,
    name: "Weerapat Aphiphuwong",
    nickname: "Film",
    github: "https://github.com/FilmPNG",
    linkedin: "https://www.linkedin.com/in/weerapat-aphiphuwong-a96406341/",
    image: img1,
  },
  {
    id: 2,
    name: "Tas Sukastid",
    nickname: "Tas",
    github: "https://github.com/TasSukastid",
    linkedin: "https://www.linkedin.com/in/tas-sukastid-bcc/",
    image: img2,
  },
  {
    id: 3,
    name: "Yanaphat Jumpaburee",
    nickname: "First",
    github: "https://github.com/First97",
    linkedin: "https://www.linkedin.com/in/yanaphat-jum-51905938b/",
    image: img3,
  },
  {
    id: 4,
    name: "Kongphop Kaochot",
    nickname: "Kong",
    github: "https://github.com/Konggarage",
    linkedin: "https://www.linkedin.com/in/kongphop-kaochot-14408a339/",
    image: img4,
  },
  {
    id: 5,
    name: "Taned Somchervieng",
    nickname: "Ake",
    github: "https://github.com/tanert48",
    linkedin: "https://www.linkedin.com/in/taned-somchirvieng-788918373",
    image: img5,
  },
  {
    id: 6,
    name: "Peeranut Machaivech",
    nickname: "Ohm",
    github: "https://github.com/ohmmyrisingstar",
    linkedin: "https://linkedin.com/in/sirapat",
    image: img6,
  },
];

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Meet Our Team</h1>
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div className="team-card" key={member.id}>
            <div className="member-image-wrapper">
              <img
                src={member.image}
                alt={member.nickname}
                className="member-image"
              />
            </div>
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-nickname">"{member.nickname}"</p>
              <div className="member-links">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link github"
                  aria-label={`GitHub of ${member.name}`}
                >
                  GitHub
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link linkedin"
                  aria-label={`LinkedIn of ${member.name}`}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}