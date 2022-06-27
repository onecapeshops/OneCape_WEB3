import React from 'react';
import SecondaryLayout from '../../components/SecondaryLayout';
import { PRIMARY } from '../../uicontants';

const PosterUpload = (props) => {
  return (
    <SecondaryLayout title="Poster Upload" route={props}>
      <form style={{
        marginTop: 50,
        backgroundColor: "white",
        padding: 10
      }}>
        <label htmlFor='#file' />
        <input type="file" id="file"  />
        <input
        name="title"
          placeholder="Title"
          style={{
            width: '100%',
            padding: 10,
            marginTop: 10,
            backgroundColor: 'lightgray',
            borderRadius: 10,
          }}
        />
        <textarea
        name="description"
          placeholder='description'
          rows={4}
          style={{
            width: '100%',
            marginTop: 10,
            padding: 10,
            backgroundColor: 'lightgray',
            borderRadius: 10,
          }}
        >
          {' '}
        </textarea>
        <button
          type="submit"
          style={{
            padding: 6,
            marginTop: 10,
            width: '100%',
            borderRadius: 10,
            color: 'white',
            textAlign: 'center',
            backgroundColor: PRIMARY,
          }}
        >
          <p>Publish</p>
        </button>
      </form>
    </SecondaryLayout>
  );
};

export default PosterUpload;
