import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Components/Post';
import { db, auth } from './firebase';
import Modal from "@material-ui/core/Modal";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './Components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user logged in
        // console.log(authUser);
        console.log(user);
        setUser(authUser);

      }
      else{
        //user logged out
        setUser(null);
      }
    })
    return () => {
      // perform some clean up action
      unsubscribe();
    }
  },[user, username]);

  useEffect( () => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {

      setPosts(snapshot.docs.map( doc => ({
        id:doc.id,
        post:doc.data()
       }) ) );
    })
  }, []);

  const signUp = (event)=> {
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email,password).then(
        (authUser) => {
          return authUser.user.updateProfile({
            displayName: username,
          })
        }
      ).catch(
        (error)=> alert(error.message)
      );

      setOpen(false);
  }

  const login =(event)=> {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(
      (error)=> alert(error.message)
    );

    setOpenSignin(false);
  } 

  return (
    <div className="App">

      

      <Modal 
      open = {open}
      onClose = {() => setOpen(false)}> 

        <div style={modalStyle} className={classes.paper}>

          <form className="app_signup">
            <center >
                <img 
                    className="app_headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt="Instagram"
                />
                <div className="app_signupInput">
                  <Input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" onClick={signUp}>Sign Up</Button>

                </center>
          </form>
              
        </div>

      </Modal>

      <Modal 
      open = {openSignin}
      onClose = {() => setOpenSignin(false)}> 

          <div style={modalStyle} className={classes.paper}>

            <form className="app_signup">
              <center >
                  <img 
                      className="app_headerImage"
                      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                      alt="Instagram"
                  />
                  <div className="app_signupInput">
                    <Input
                      type="text"
                      placeholder="email"
                      value={email}
                      onChange={(e)=> setEmail(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="password"
                      value={password}
                      onChange={(e)=> setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" onClick={login}>Log In</Button>

                  </center>
            </form>
                
          </div>
        </Modal>
      

      <div className="app_header">
        <img className="app_headerImage" alt="Instagram" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" ></img>
      
          {user ? (
            <Button onClick={ ()=> auth.signOut()}>Logout</Button>
          ):(
            <div className="app_loginContainer">
              <Button onClick={() => setOpenSignin(true)}>Log In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          
          )}

      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
        {
            posts.map( ({id, post}) => {
              return <Post key={id} postId={id} signedInUser={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            })
          }
        </div>
        
        <div className="app_postsRight">
          {/* <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={500}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> */}
        </div>
        
      </div>

      

      


      {/* user can only upload once logged in*/}
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/> ):(
          <h3 className="app_loginMessage">Sorry you need to login to upload</h3>
        )
      }

    </div>
  );
}

export default App;
