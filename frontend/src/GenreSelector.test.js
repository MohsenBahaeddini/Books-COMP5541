import { render, fireEvent, screen } from '@testing-library/react';
import GenreSelector from './genre/GenreSelector';

describe('GenreSelector', () => {
  let onApplyMock;

  beforeEach(() => {
    onApplyMock = jest.fn();
    render(<GenreSelector onApply={onApplyMock} />);
  });

  it('should render the component correctly', () => {
    expect(screen.getByText('Select Genres')).toBeInTheDocument();
  });

  it('should open the modal when the "Select Genres" button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Select Genres' }));
    expect(screen.getByRole('button', { name: 'Select Genres' })).toBeInTheDocument();
  });

  it('should close the modal when the "Cancel" button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Select Genres' }));
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('should select all genres when the "Select All" button is clicked', () => {
    fireEvent.click(screen.getByText('Select Genres'));
    fireEvent.click(screen.getByText('Select All'));
    const genreCheckboxes = screen.getAllByRole('checkbox');
    genreCheckboxes.forEach(checkbox => expect(checkbox).toBeChecked());
  });

  it('should deselect all genres when the "Deselect All" button is clicked', () => {
    fireEvent.click(screen.getByText('Select Genres'));
    fireEvent.click(screen.getByText('Deselect All'));
    const genreCheckboxes = screen.getAllByRole('checkbox');
    genreCheckboxes.forEach(checkbox => expect(checkbox).not.toBeChecked());
  });

  it('should update the selected genres when a genre checkbox is clicked', () => {
    fireEvent.click(screen.getByText('Select Genres'));
    fireEvent.click(screen.getByLabelText('Adventure'));
    expect(screen.getByLabelText('Adventure')).not.toBeChecked();
  });

  it('should call the onApply function with the selected genres when the "Apply" button is clicked', () => {
    fireEvent.click(screen.getByText('Select Genres'));
    fireEvent.click(screen.getByText('Deselect All'));
    fireEvent.click(screen.getByLabelText('Adventure'));
    fireEvent.click(screen.getByText('Apply'));
    expect(onApplyMock).toHaveBeenCalledWith(['Adventure']);
  });
});
