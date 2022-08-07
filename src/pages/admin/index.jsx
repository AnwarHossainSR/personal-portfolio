import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/admin/Badge';
import Table from '../../components/admin/Table';

const latestOrders = {
  header: ['Title', 'Tags', 'Image', 'Date', 'status'],
  body: [
    {
      title: 'Ecommerce App',
      tags: 'React',
      image: 'image',
      date: '17 Jun 2021',
      status: 'shipping',
    },
  ],
};

const orderStatus = {
  active: 'success',
  inactive: 'danger',
};

const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

const renderOrderBody = (item, index) => (
  <tr key={index}>
    <td>{item.title}</td>
    <td>{item.tags}</td>
    <td>{item.image}</td>
    <td>{item.date}</td>
    <td>
      <Badge type={orderStatus['active']} content={item.status} />
    </td>
  </tr>
);

const Dashboard = () => {
  return (
    <>
      <div className='admin-row'>
        <div className='admin-col-12'>
          <div className='admin-card'>
            <div className='admin-card__header'>
              <h3>Portfolios</h3>
              <Link to='../add-portfolios'>Add Portfolio</Link>
            </div>
            <div className='admin-card__body'>
              <Table
                headData={latestOrders.header}
                renderHead={(item, index) => renderOrderHead(item, index)}
                bodyData={latestOrders.body}
                renderBody={(item, index) => renderOrderBody(item, index)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
