import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadForm from './UploadForm';
import * as api from '../services/api';

jest.mock('../services/api');

describe('UploadForm', () => {
  it('uploads a .mp3 file, calls uploadNote, and disables button during upload', async () => {
    const mockUploadNote = jest.fn(() => new Promise(resolve => setTimeout(() => resolve({ id: '123', audio_file: 'test.mp3' }), 100)));
    api.uploadNote.mockImplementation(mockUploadNote);
    const onUploaded = jest.fn();
    render(<UploadForm onUploaded={onUploaded} />);

    // Simulate file selection
    const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });
    const input = screen.getByLabelText(/upload/i) || screen.getByRole('textbox', { hidden: true }) || screen.getByRole('button', { name: /upload/i });
    const fileInput = screen.getByDisplayValue('') || screen.getByRole('textbox', { hidden: true }) || screen.getByRole('input');
    // fallback: get input[type=file]
    const fileInputEl = screen.getByLabelText(/file/i) || document.querySelector('input[type="file"]');
    fireEvent.change(fileInputEl, { target: { files: [file] } });

    // Click upload
    const button = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(mockUploadNote).toHaveBeenCalled();

    // Wait for upload to finish
    await waitFor(() => expect(button).not.toBeDisabled());
    expect(onUploaded).toHaveBeenCalledWith({ id: '123', audio_file: 'test.mp3' });
  });
});
