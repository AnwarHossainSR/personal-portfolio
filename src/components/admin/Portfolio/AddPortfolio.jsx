import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortfolioAction } from '../../../redux/actions/PortfolioAction';

const AddPortFolio = () => {
  const { isLoading, message, error } = useSelector(
    (state) => state.portfolios
  );
  const dispatch = useDispatch();
  const [file, setfile] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputObject = Object.fromEntries(formData);
    dispatch(createPortfolioAction(inputObject, file));
  };
  const handleCHange = (e) => {
    if (!e.target.files.length > 0) return;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (readerEvent) => {
      setfile(readerEvent.target.result);
    };
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
              <form onSubmit={handleSubmit}>
                {message && (
                  <div className='success' style={{ paddingBottom: 10 }}>
                    {message}
                  </div>
                )}
                {error && (
                  <div className='error' style={{ paddingBottom: 10 }}>
                    {error}
                  </div>
                )}
                <div className='admin-row'>
                  <div
                    className='admin-col-6 form-group'
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <input
                      type='text'
                      required
                      name='title'
                      placeholder='title..'
                      className='form-control'
                    />
                    <input
                      type='text'
                      required
                      name='website'
                      className='form-control'
                      placeholder='website link..'
                    />
                    <input
                      type='text'
                      required
                      name='github'
                      className='form-control'
                      placeholder='github link..'
                    />
                    <input
                      type='text'
                      required
                      name='tags'
                      className='form-control'
                      placeholder='tags'
                    />
                    <textarea
                      className='form-control'
                      name='description'
                      cols='30'
                      rows='5'
                      placeholder='description...'
                      required
                    />
                    <div className='form-button'>
                      <button>{isLoading ? 'loading..' : 'Submit'}</button>
                    </div>
                  </div>
                  <div className='admin-col-6'>
                    {file ? (
                      <img src={file} alt='' width={550} height={300} />
                    ) : (
                      <input
                        type='file'
                        onChange={handleCHange}
                        name='file'
                        accept='image/*'
                        required
                      />
                    )}
                  </div>
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
