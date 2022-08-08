import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { db } from "../../../utils/firebase";
import Badge from "../Badge";
import Table from "../Table";

const portfolioStatus = {
  active: "success",
  inactive: "danger",
};

const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

const renderOrderBody = (item, index) => {
  console.log(item);
  return (
    <tr key={index} onClick={() => console.log(item.id)}>
      <td>{item.data().title}</td>
      <td>
        {item.data().tags.map((tag, index) => (
          <span
            key={index}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            {tag}
          </span>
        ))}
      </td>
      <td>
        <img src={item.data().image} width={100} height={70} alt="" />
      </td>
      <td>
        <Moment fromNow>{item.data().date?.toDate()}</Moment>
      </td>
      <td>
        <Badge
          type={portfolioStatus[item.data().status]}
          content={item.data().status}
        />
      </td>
    </tr>
  );
};

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "portfolios"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPortfolios(snapshot.docs);
        }
      ),
    []
  );
  return (
    <>
      <div className="admin-row">
        <div className="admin-col-12">
          <div className="admin-card">
            <div className="admin-card__header">
              <h3>Portfolios</h3>
              <Link to="../add">Add Portfolio</Link>
            </div>
            <div className="admin-card__body">
              {portfolios && portfolios.length > 0 && (
                <Table
                  headData={["Title", "Tags", "Image", "Date", "status"]}
                  renderHead={(item, index) => renderOrderHead(item, index)}
                  bodyData={portfolios && portfolios}
                  renderBody={(item, index) => renderOrderBody(item, index)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;

//import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
// import { collection, getDocs } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { db } from '../../../utils/firebase';
// import Badge from '../Badge';
// import Table from '../Table';

// const latestOrders = {
//   header: ['Title', 'Tags', 'Image', 'Date', 'status'],
//   body: [
//     {
//       title: 'Ecommerce App',
//       tags: 'React',
//       image: 'image',
//       date: '17 Jun 2021',
//       status: 'shipping',
//     },
//   ],
// };

// const orderStatus = {
//   active: 'success',
//   inactive: 'danger',
// };

// const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

// const renderOrderBody = (item, index) => (
//   <tr key={index}>
//     <td>{item.title}</td>
//     <td>{item.tags}</td>
//     <td>{item.image}</td>
//     <td>{item.date}</td>
//     <td>
//       <Badge type={orderStatus['active']} content={item.status} />
//     </td>
//   </tr>
// );

// const Portfolio = () => {
//   const [portfolios, setPortfolios] = useState([]);
//   const fetchData = async () => {
//     const querySnapshot = await getDocs(collection(db, 'portfolios'));
//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, ' => ', doc.data());
//     });
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // useEffect(
//   //   () =>
//   //     onSnapshot(
//   //       query(collection(db, 'portfolios'), orderBy('timestamp', 'desc')),
//   //       (snapshot) => {
//   //         console.log(snapshot.docs);
//   //         setPortfolios(snapshot.docs);
//   //       }
//   //     ),
//   //   []
//   // );

//   return (
//     <>
//       <div className='admin-row'>
//         <div className='admin-col-12'>
//           <div className='admin-card'>
//             <div className='admin-card__header'>
//               <h3>Portfolios</h3>
//               <Link to='../add'>Add Portfolio</Link>
//             </div>
//             <div className='admin-card__body'>
//               <Table
//                 headData={latestOrders.header}
//                 renderHead={(item, index) => renderOrderHead(item, index)}
//                 bodyData={
//                   portfolios.length > 0 ? portfolios : latestOrders.body
//                 }
//                 renderBody={(item, index) => renderOrderBody(item, index)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Portfolio;
