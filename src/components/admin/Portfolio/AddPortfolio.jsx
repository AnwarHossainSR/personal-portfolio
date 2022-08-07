import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortfolioAction } from '../../../redux/actions/PortfolioAction';

const AddPortFolio = () => {
  const { isLoading, message, error } = useSelector(
    (state) => state.portfolios
  );
  const dispatch = useDispatch();
  const [file, setfile] = useState(null);
  const [tags, setTags] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputObject = Object.fromEntries(formData);
    inputObject.tags = tags;
    inputObject.status = 'active';
    dispatch(createPortfolioAction(inputObject, file));
    e.target.reset();
    setfile(null);
    setTags([]);
  };
  const handleCHange = (e) => {
    if (!e.target.files.length > 0) return;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (readerEvent) => {
      setfile(readerEvent.target.result);
    };
  };
  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = '';
    e.target.focus();
  };
  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
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
                    <div
                      style={{
                        width: '95.5%',
                      }}
                    >
                      <div
                        style={{
                          width: '95.5%',
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '.5rem',
                        }}
                      >
                        {tags &&
                          tags.length > 0 &&
                          tags.map((tag, index) => (
                            <div
                              key={index}
                              className='tags'
                              onClick={removeTag}
                            >
                              {tag}
                            </div>
                          ))}
                      </div>
                      <input
                        type='text'
                        {...(tags && tags.length <= 0 && { required: true })}
                        name='tags'
                        className='form-control'
                        placeholder='tags'
                        onKeyDown={handleKeyDown}
                        style={{ width: '100%' }}
                      />
                    </div>
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
                    {file !== null ? (
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
