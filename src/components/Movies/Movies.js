import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../index.css';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

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

  //Fetch movie data
  const fetchMovies = async () => {
    const { data } = await axios.get(
      `https://skyit-coding-challenge.herokuapp.com/movies`
    );
    setMovies(data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const directors = movies.map((val) => {
    return `${val.director}`;
  });

  const certifications = ['General', '14 Accompaniment', 'CA-PG'];

  //Director Filter
  const directorFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={directors}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel='director'
        //className='p-column-filter'
        placeholder='All'
        maxSelectedLabels={3}
      />
    );
  };

  //Certification Filter
  const certBodyTemplate = (rowData) => {
    return (
      <span className={`certification-badge status-${rowData.certification}`}>
        {rowData.certification}
      </span>
    );
  };

  const certItemTemplate = (option) => {
    return (
      <span className={`certification-badge status-${option}`}>{option}</span>
    );
  };

  const certFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={certifications}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={certItemTemplate}
        placeholder='Select a Status'
        className='p-column-filter'
        showClear
      />
    );
  };

  //Rating template
  const formatRate = (value) => {
    let rate = (value / 5) * 100;
    return rate.toFixed(2) + '%';
  };

  const ratingBodyTemplate = (rowData) => {
    return formatRate(rowData.rating);
  };

  const ratingFilterTemplate = (options) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value, options.index)}
        placeholder='Select Rating'
      />
    );
  };

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
          filterField='director'
          filter
          filterElement={directorFilterTemplate}
          showFilterMenu={false}
          filterMenuStyle={{ width: '20rem' }}
          style={{ minWidth: '20rem' }}
        ></Column>
        <Column
          field='certification'
          header='Certification'
          filter
          body={certBodyTemplate}
          filterElement={certFilterTemplate}
          showFilterMenu={false}
          filterMenuStyle={{ width: '14rem' }}
          style={{ minWidth: '14rem' }}
        ></Column>
        <Column
          //field='rating'
          header='Rating'
          filterField='rating'
          filter
          body={ratingBodyTemplate}
          filterElement={ratingFilterTemplate}
          showFilterMenu={false}
        ></Column>
      </DataTable>
    </>
  );
};

export default Movies;
