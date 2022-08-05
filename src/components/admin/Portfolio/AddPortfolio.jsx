import React, { useRef } from 'react';

const AddPortFolio = () => {
  const formRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formRef.current);
  };
  return (
    <>
      <div className='admin-row'>
        <div className='admin-col-12'>
          <div className='admin-card'>
            <div className='admin-card__header'>
              <h3>Add Portfolio</h3>
            </div>
            <div className='admin-card__body'>
              <form onSubmit={handleSubmit} ref={formRef}>
                <div className='admin-row'>
                  <div
                    className='admin-col-8'
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <input type='text' placeholder='title..' />
                    <input type='text' placeholder='website link..' />
                    <input type='text' placeholder='github link..' />
                    <input type='text' placeholder='tags' />
                    <textarea name='description' cols='30' rows='10' />
                  </div>
                  <div className='admin-col-4'>Image</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPortFolio;
