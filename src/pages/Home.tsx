import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import { AndroidPermissions } from '@ionic-native/android-permissions'
import React from 'react';
import OT from '@opentok/client';
import './Home.css';

class Home extends React.Component<{}, { apiKey: string, sessionId: string, token: string,  buttonAction: any }> {
  constructor(props: any) {
    super(props);
    this.state = {
      apiKey: '',
      sessionId: '',
      token: '',
      buttonAction: () => this.initializeSession()
    };
  }

  handleError(error: any) {
    if (error) {
      alert(error.message);
    }
  }

  initializeSession() {
    var session = OT.initSession(this.state.apiKey, this.state.sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', (event: any) => {
      session.subscribe(event.stream, 'subscriber', {
        width: '100%',
        height: '100%'
      }, this.handleError);
    });

    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      publishVideo: false,
      width: '100%',
      height: '100%'
    }, this.handleError);


    // Connect to the session
    session.connect(this.state.token, (error: any) => {
      // If the connection is successful, publish to the session
      if (error) {
        this.handleError(error);
      } else {
        session.publish(publisher, this.handleError);
      }
    });
  }

  componentDidMount() {
    if (isPlatform('android')) {
      AndroidPermissions.requestPermissions([
        AndroidPermissions.PERMISSION.CAMERA,
        AndroidPermissions.PERMISSION.RECORD_AUDIO,
      ])
    }
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>BasicVideoChat-Ionic</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">BasicVideoChat-Ionic</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div id="videos">
            <div id="subscriber"></div>
            <div id="publisher"></div>
          </div>
        </IonContent>
        <IonButton onClick={this.state.buttonAction}>
          click
        </IonButton>
      </IonPage>
    );
  }
}

export default Home;
