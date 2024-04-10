// Importing necessary libraries and components
import React, { ChangeEvent } from 'react';
// import "./GenreSelector.css";
import Button from "@material-ui/core/Button";

// Defining the state interface
interface State {
  showModal: boolean; // To control the visibility of the modal
  selectedGenres: string[]; // List to store the genres selected by the user
  genres: string[]; // List of all available genres
}

// Defining the props interface
interface Props {
  onApply: (selectedGenres: string[]) => void; // Function to be called when the user applies their genre selection
}

// GenreSelector component
class GenreSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      // List of genres pre-selected for the user
      selectedGenres: [
        "Adventure", "Anthology", "Art", "Autobiography", "Biography", "Business",
        "Children", "Classic", "Cookbook", "Comedy", "Comics", "Crime", "Drama",
        "Essay", "Fantasy", "Fable", "Fairy tale", "Fan fiction", "Fiction", "Health",
        "History", "Historical Fiction", "Horror", "Memoir", "Mystery", "Non Fiction",
        "Periodical", "Philosophy", "Poetry", "Psychology", "Reference", "Religion",
        "Romance", "Satire", "Science", "Science fiction", "Self help", "Short story",
        "Sports", "Thriller", "Travel", "Young adult"
      ],
      // List of all available genres
      genres: [
        "Adventure", "Anthology", "Art", "Autobiography", "Biography", "Business",
        "Children", "Classic", "Cookbook", "Comedy", "Comics", "Crime", "Drama",
        "Essay", "Fantasy", "Fable", "Fairy tale", "Fan fiction", "Fiction", "Health",
        "History", "Historical Fiction", "Horror", "Memoir", "Mystery", "Non Fiction",
        "Periodical", "Philosophy", "Poetry", "Psychology", "Reference", "Religion",
        "Romance", "Satire", "Science", "Science fiction", "Self help", "Short story",
        "Sports", "Thriller", "Travel", "Young adult"
      ]
    };
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleDeselectAll = this.handleDeselectAll.bind(this);
  }
  // Method to open the modal
  handleOpen = () => {
    this.setState({ showModal: true });
  };
  // Method to close the modal
  handleClose = () => {
    this.setState({ showModal: false });
  };
  // Method to select all genres
  handleSelectAll = () => {
    const { genres } = this.state;
    this.setState({ selectedGenres: [...genres] });
  };
  // Method to deselect all genres
  handleDeselectAll = () => {
    this.setState({ selectedGenres: [] });
  };
  // Method to handle change in genre selection
  handleGenreChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { selectedGenres } = this.state;
    const { value } = event.target;
    const updatedGenres = selectedGenres.includes(value)
      ? selectedGenres.filter(genre => genre !== value)
      : [...selectedGenres, value];
    this.setState({ selectedGenres: updatedGenres });
  };
  // Method to apply the selected genres
  handleApply = () => {
    this.props.onApply(this.state.selectedGenres);
    this.handleClose();
  };

  render() {
    const { showModal, genres, selectedGenres } = this.state;
    // Styles for the modal and its content
    const modalStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
  }

    const modalContentStyle: React.CSSProperties = {
        backgroundColor: '#fefefe',
        margin: '15% auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%',
    };

    const genresContainerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px',
        padding: '20px'
    };


    return (
      <div>
        <Button 
          variant="contained"
          className="tempButton"
          color="primary"
          disableElevation 
          onClick={this.handleOpen}
        >
            Select Genres
        </Button>

        {showModal && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h2>Select Genres</h2>
              <div>
              <Button color="default" className="tempButton" variant="contained" onClick={this.handleDeselectAll}>Deselect All</Button>
              <Button color="default" className="tempButton" variant="contained" onClick={this.handleSelectAll}>Select All</Button>
              </div>
              </div>
              <div style={genresContainerStyle}>
                {genres.map(genre => (
                  <div key={genre}>
                    <input
                      type="checkbox"
                      id={genre}
                      value={genre}
                      checked={selectedGenres.includes(genre)}
                      onChange={this.handleGenreChange}
                      style={{marginRight:"5px"}}
                    />
                    <label htmlFor={genre}>{genre}</label>
                  </div>
                ))}
              </div>
              <div style={{display:"flex", justifyContent: 'space-between', marginTop:"5px"}}>
                <Button color="default" className="tempButton" variant="contained" onClick={this.handleClose}>Cancel</Button>
                <Button color="primary" className="tempButton" variant="contained" onClick={this.handleApply}>Apply</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}  
export default GenreSelector;
