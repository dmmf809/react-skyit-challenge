import { useState, useEffect } from 'react';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [filter, setFiltered] = useState({
    title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    releaseDate: { value: null, matchMode: FilterMatchMode.EQUALS },
    length: { value: null, matchMode: FilterMatchMode.EQUALS },
    director: { value: null, matchMode: FilterMatchMode.IN },
    certification: { value: null, matchMode: FilterMatchMode.EQUALS },
    rating: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const fetchMovies = async () => {
    const { data } = await axios.get(
      `https://skyit-coding-challenge.herokuapp.com/movies`
    );
    setMovies(data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const movieRating = movies.map((rate) => `${rate.rating}`);
  let rating = [];
  for (let i = 0; i < movieRating.length; i++) {
    let rate = (movieRating[i] /= 5);
    let ratePercentage = rate * 100;
    console.log((rating = ratePercentage.toFixed(2).toString() + '%'));
  }

  return (
    <>
      <DataTable
        value={movies}
        selection={selectedMovie}
        onSelectionChange={(e) => setSelectedMovie(e.value)}
        paginator
        rows={10}
        filterDisplay='row'
        filters={filter}
        emptyMessage='No Movies Found'
        responsiveLayout='scroll'
      >
        <Column selectionMode='single' headerStyle={{ width: '3em' }}></Column>
        <Column
          field='title'
          header='Title'
          filter
          showFilterMenu={false}
          filterPlaceholder='Search by title'
        ></Column>
        <Column
          field='releaseDate'
          header='Year'
          filter
          showFilterMenu={false}
          filterPlaceholder='Search by year'
        ></Column>
        <Column
          field='length'
          header='Running Time'
          filter
          showFilterMenu={false}
          filterPlaceholder='Search by time'
        ></Column>
        <Column
          field='director'
          header='Director'
          filter
          showFilterMenu={false}
          filterPlaceholder='All'
        ></Column>
        <Column
          field='certification'
          header='Certification'
          filter
          showFilterMenu={false}
          filterPlaceholder='Select a Status'
        ></Column>
        <Column
          field='rating'
          header='Rating'
          filter
          showFilterMenu={false}
          filterPlaceholder='Search by rating'
        ></Column>
      </DataTable>
    </>
  );
};

export default Movies;
