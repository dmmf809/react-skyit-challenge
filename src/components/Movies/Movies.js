import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../index.css';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Chip } from 'primereact/chip';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [filter, setFilter] = useState({
    title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    releaseDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    length: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    director: { value: null, matchMode: FilterMatchMode.IN },
    certification: { value: null, matchMode: FilterMatchMode.EQUALS },
    rating: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [rate, setRate] = useState('');

  //Dialog positioning
  const [displayPosition, setDisplayPosition] = useState(false);
  const [position, setPosition] = useState('center');

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

  const handleSelect = (e) => setSelectedMovie(e.value);

  //Dialog
  const dialogFuncMap = {
    displayPosition: setDisplayPosition,
  };

  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
    setSelectedMovie([]);
  };

  const renderFooter = () => {
    return <div>All movie data are from Wikipedia and IMDb.</div>;
  };

  //Director Filter
  const directors = [
    'John Carney',
    'Patty Jenkins',
    'Travis Fine',
    'Amy Poehler',
    'David Ayer',
    'Zack Snyder',
    'Pete Docter',
    'Ryan Coogler',
    'Luc Besson',
  ];

  const directorItemTemplate = (option) => {
    return (
      <div className='p-multiselect-director-option'>
        <span>{option}</span>
      </div>
    );
  };

  const directorFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={directors}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={directorItemTemplate}
        placeholder='All'
        maxSelectedLabels={3}
      />
    );
  };

  //Certification Filter
  const certifications = ['General', '14 Accompaniment', 'CA-PG'];

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
        showClear
      />
    );
  };

  //Rating template
  const handleRate = (e) => {
    const value = e.target.value;
    let _filter = { ...filter };
    _filter['rating'].value = value;

    setFilter(_filter);
    setRate(value);
  };

  const ratingBodyTemplate = (rowData) => {
    return formatRate(rowData.rating);
  };

  const formatRate = (value) => {
    let rate = (value / 5) * 100;
    return rate.toFixed(2) + '%';
  };

  const ratingFilterTemplate = () => {
    return (
      <InputText
        value={rate}
        onChange={handleRate}
        placeholder='Select Rating'
      />
    );
  };

  return (
    <div className='card'>
      <h1 className='p-d-flex p-jc-center'>Favorite Movie List</h1>
      <DataTable
        value={movies}
        selection={selectedMovie}
        onRowClick={() => onClick('displayPosition', 'right')}
        onSelectionChange={(e) => handleSelect(e)}
        paginator
        rows={10}
        filterDisplay='row'
        filters={filter}
        emptyMessage='No Movies Found'
        //responsiveLayout='scroll'
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
          header='Rating'
          filterField='rating'
          filter
          dataType='numeric'
          body={ratingBodyTemplate}
          filterElement={ratingFilterTemplate}
          showFilterMenu={false}
        ></Column>
      </DataTable>
      <Dialog
        header='MOVIE DETAILS'
        visible={displayPosition}
        position={position}
        modal
        style={{ width: '35vw' }}
        onHide={() => onHide('displayPosition')}
        footer={renderFooter()}
        draggable={false}
        resizable={false}
      >
        <div className='movie-details'>
          <h3 className='p-d-flex p-jc-center'>{`${selectedMovie.title}`}</h3>
          <h4 className='p-d-flex p-jc-center'>
            Directed by {`${selectedMovie.director}`}
          </h4>
          <div className='label'>
            Cast:{' '}
            {selectedMovie.cast &&
              selectedMovie.cast.map((val, i) => {
                return <Chip key={i} label={val} className='cast-genre' />;
              })}
          </div>
          <div className='label'>
            Genre:{' '}
            {selectedMovie.genre &&
              selectedMovie.genre.map((val, i) => {
                return <Chip key={i} label={val} className='cast-genre' />;
              })}
          </div>
          <p className='plot-title'>Plot: </p>
          <p className='plot'>{`${selectedMovie.plot}`}</p>
        </div>
      </Dialog>
    </div>
  );
};

export default Movies;
