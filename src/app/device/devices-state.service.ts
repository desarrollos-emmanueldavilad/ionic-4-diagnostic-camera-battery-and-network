import { Injectable } from '@angular/core';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Observable, Subject } from 'rxjs';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
@Injectable({
  providedIn: 'root'
})
export class DevicesStateService {
  batterySubscription: any;
  level: number;
  signal: string;
  plugin: boolean;
  public batterylevel: any;
  public poorSignal: any;
  batteryData: boolean;
  subscrip: any;
  lowBatterEvent: Subject<any> = new Subject<any>();
  badSignal: Subject<any> = new Subject<any>();
  wifiConnection: Subject<any> = new Subject<any>();
  lowBatterEvent1: Subject<any> = new Subject<any>();
  lowBatterEvent2: Subject<any> = new Subject<any>();
  constructor(
    private batteryStatus: BatteryStatus,
    private network: Network,
    private diagnostic: Diagnostic
  ) {}

  /**
   * BATTERY:
   *
   *
   */


/**
   * BATTERY Option  1
   */
  // public checkBattery(levelBat: number): Observable<any> {
  //   return new Observable(observer => {
  //     this.batteryStatus.onChange().subscribe(status => {
  //       if (status.level < levelBat) {
  //         this.level = status.level;
  //         observer.next(this.level);
  //       } else if (status.level > levelBat) {
  //         console.log('mayor');
  //         this.level = status.level;
  //       }
  //     });
  //   });
  // }

  /**
   * BATTERY Option 2
   */

  public checkBattery1(levelBat: number): Observable<any> {
    return new Observable(observer => {
      this.batteryStatus.onChange().subscribe(status => {
        if (status.level) {
          this.level = status.level;
          observer.next(this.level);
         // observer.complete()
        } else {
          console.log('tienes problemas con tu bateria');
        }
      });
    });
  }
/**
   * BATTERY Stop
   */
  public stopBatteryCheck(): Observable<any> {
    return new Observable(observer => {
      observer.next(this.subscrip.unsubscribe());
      observer.complete();
    });
  }

  /**
   * NetWORK:
   *
   *
   */


/**
   * NetWORK Option 1
   */

  public connect(tipo: string): Observable<any> {
    return new Observable(observer => {
      this.network.onConnect().subscribe(status => {
        console.log('network connected!',status);
        if (this.network.type) {
          this.signal = this.network.type;
          observer.next(this.signal);
        } else {
          console.log('error en la conección');
        }
        // observer.complete();
      });
    });
  }

 
  /**
   * Diagnostic:
   *
   *
   */

    /**
   * Diagnostic Option web
   */

 public cameraWeb(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log('enumerateDevices() not supported.');
        return resolve(false);
      }
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          devices.forEach(device => {
            alert(device);
            console.log(device);
            //device.kind === 'audioinput' for audio
            if (device.kind === 'videoinput') {
              alert(true);
              resolve(true);
            }
          });
        })
        .catch(err => {
          console.log(err.name + ': ' + err.message);
        });
    });
  }

  /**
   * Diagnostic Option 1
   */
  private camaraAvailable(): Promise<any> {
    return new Promise<any>(resolve => {
      this.diagnostic
        .isCameraAvailable()
        .then(res => resolve(res))
        .catch(err =>
          console.error('Se ha producido un error en camaraAvailable: ', err)
        );
    });
  }

    /**
   * Diagnostic Option 2
   */
  public camaraPresent(): Promise<any> {
    return new Promise<any>(resolve => {
      this.diagnostic
        .isCameraPresent()
        .then(res => resolve(res))
        .catch(err =>
          console.error('Se ha producido un error en  camaraPresent: ', err)
        );
    });
  }

    /**
   * Diagnostic Option 3
   */ 
  public camaraAuthorized(): Promise<any> {
    return new Promise<any>(resolve => {
      this.diagnostic
        .isCameraAuthorized()
        .then(res => resolve(res))
        .catch(err =>
          console.error('Se ha producido un error en  camaraAuthorized: ', err)
        );
    });
  }

    /**
   * Diagnostic Option 4
   */
  private camaraAuthorizedStatus(): Promise<any> {
    return new Promise<any>(resolve => {
      this.diagnostic
        .getCameraAuthorizationStatus()
        .then(res => resolve(res))
        .catch(err =>
          console.error(
            'Se ha producido un error en  camaraAuthorizedStatus: ',
            err
          )
        );
    });
  }
    /**
   * Diagnostic Option 5
   */

  private requestCamera(): Promise<any> {
    return new Promise<any>(resolve => {
      this.diagnostic
        .requestCameraAuthorization()
        .then(res => resolve(res))
        .catch(err =>
          console.error('Se ha producido un error en  requestCamera: ', err)
        );
    });
  }
}
