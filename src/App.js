import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Vimeo } from 'vimeo';
import "./App.css";

const client = new Vimeo(
  "a3a6c73711cd1861d6e0870fd2c10b8d30d3d1db",
  "nIXlrqGm1Lnvcz8EUghZ+p/SzI6ixZphJV2X/2az9rQRSk0FmiO/kHbSlfy9bPfN3QgXU54LVuiCNbGBAYvGfL+I/RquvHOoLP7CSub/uY0ki4j6bSQF1gpeFjWEnfRU",
  "0af5e73db053eb9a4c915d7f6ee04f84"
);
export default class extends Component {

  state = {
    name: '',
    description: '',
    progress: 0,
  }

  componentDidMount() {
    const that = this;
    const fileInput = document.getElementById('video-file');
    fileInput.addEventListener('change', () => {
      that.setState({ progress: 0 });
      if (fileInput.files.length === 0) {
        that.setState({ name: '' });
      } else {
        const fileName = fileInput.value.split(/(\\|\/)/g).pop();
        that.setState({ name: fileName });
      }
    });
  }

  isFileSelected = () => {
    const fileInput = document.getElementById('video-file');
    return fileInput && fileInput.files.length > 0;
  }

  upload = () => {
    this.setState({ progress: 0 });
    const fileInput = document.getElementById('video-file');
    if (fileInput.files.length === 0) {
      console.log('no file');
      alert('Please choose a video file to upload');
      return;
    }
    console.log('upload',fileInput.files[0]);
    client.upload(
      fileInput.files[0],
      {
        'name': 'Test',
        'description': 'No Description',
      },
      (uri) => {
        alert('uploaded successfully.');
      },
      (bytesUploaded, bytesTotal) => {
        const progress = (bytesUploaded / bytesTotal * 100).toFixed(2);
        this.setState({ progress });
      },
      (error) => {
        alert(error);
      },
    );
  }

  handleChange = fieldName => e => {
    this.setState({ [fieldName]: e.target.value });
  }

  render() {
    const {progress} = this.state;
    return (
      <div className="container">
        <LinearProgress variant="determinate" value={progress} className="mt-5" />
        <label htmlFor="video-file">
          <input
            accept=".mp4, .avi"
            className="input"
            id="video-file"
            type="file"
          />
          <Button component="span" className="mt-5" fullWidth color="secondary">
            Browse
          </Button>
        </label>
        <Button
          component="span"
          className="mt-5"
          fullWidth
          color="secondary"
          onClick={this.upload}
        >
            Upload
        </Button>
      </div>
    );
  }
}