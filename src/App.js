import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';


const app = new Clarifai.App({
  apiKey: 'ac3670ccc4304eaaa2fb36f02453d519'
 });


const particleOptions = {
  "particles": {
    "number": {
      "value": 161,
      "density": {
        "enable": false,
        "value_area": 800
      }
    },
    "color": {
      "value": "#0693e1"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 9
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  }
  }


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    }
  }

  calculateFaceLocation = (data) => {
    const Face = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: Face.left_col * width,
      topRow: Face.top_row * height,
      rightCol: width - (Face.right_col * width),
      bottomRow: height - (Face.bottom_row * height)

    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box});

  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
      <Particles className='particles'
              params={particleOptions}
            />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
    );
  }
}

export default App;
