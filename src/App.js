import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Rank from './Components/Rank/Rank';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai'

//initialise api key for clarifai
const app = new Clarifai.App({
 
 //apiKey: 'add your API key here'
});

//this can be put directly in app, but, we can just define it outside to keep the code in app clean
//We can play around with particles, by reading up its documentation and usage
//ex: just see what happens to the bg, if you increase the density value 
const particlesParams={
  particles: {
    number:{
      value:60,
      density:{
        enable: true,
        value_area: 800
      }
    }
  }
}

///our driver code, more like the main of our app
class App extends Component {
  //out constructor, which initialises ans also happens to define the state of our app
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        email: '',
        name: '',
        entries: 0,
        joined: '',
      }
    }
  }

  //----------------------------------------------------------------------------------------------------------
  //start of various function calls, which mostly handles state transitoins
  //note that we havent used redux here
  //be wary of async operations
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    //DOM manipulation
    const image = document.getElementById('inputimage');
    const width= Number(image.width);
    const height= Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    console.log('click');

    //calling the api-face-detect here
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        if(response){
          fetch('http://localhost:3000/image', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response=> response.json())
          .then(count =>{
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err=> console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'signout') {
      this.setState({isSignedIn: false});
    }else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  loadUser =(data) =>{
    this.setState(
      {
        user: {
          id: data.id,
          name:data.name,
          email:data.email,
          entries:data.entries,
          joined:data.joined
        }
      }
    )
  }
  //----------------------------------------------------------------------------------------------------------
  //basic render syntax, to render our components
  render(){
    //destructuring our state variables, to avoid "this.state" before every use
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      //self explanatory piece of code
      //remeber to wrap things in {} while using javaScript code anywhere here
      <div className="App">
        <Particles className='particles'
          params={particlesParams} 
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home'
          ?  <div>
              <Logo />
              <Rank name={this.state.user.name} entries ={this.state.user.entries}/>
              {/*See how i am passing a function as a PROP*/}
              <ImageLinkForm onInputChange={this.onInputChange} 
                           onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
              route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;