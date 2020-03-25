import { Injectable } from '@angular/core';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Observable, Subject } from 'rxjs';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';
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
  constructor(
    private batteryStatus: BatteryStatus,
    private network: Network,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) {}

  /**
   * BATTERY:
   *Aqui se encuntran los metodos referentes al BatteryStatus del dispositivo
   *
   */

  /**
   * BATTERY Check
   * Este método será el que la aplicación utilice para obtener la información del dispositivo , la información del porcentaje de la bateria , y si esta conectado el dispositivo al cargador.
   * levelBat: este pararametro sera el numero del 1-100 que la aplicación utilizara para poder realizar eventos o obtener información cuando la bateria este en dicho numero de estado.
   */
  public checkBattery1(levelBat: number): Observable<any> {
    return new Observable(observer => {
      this.batteryStatus.onChange().subscribe(status => {
        if (status) {
          console.log('status battery', status);

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
   * Este método será el que la aplicación utilice para dejar de escuchar el estado de la batería
   */
  public stopBatteryCheck(): Observable<any> {
    return new Observable(observer => {
      let sub = this.batteryStatus.onChange().subscribe(status => {
        if (status) {
          console.log('stt', status);
          this.level = status.level;
          observer.next(this.level);
          // observer.complete()
        } else {
          console.log('tienes problemas con tu bateria');
        }
      });
      observer.next(sub.unsubscribe());
      observer.complete();
    });
  }

  /**
   * Network:
   *Aqui se encuntra el metodo referente al estado de la conxion a internet de el dispositivo
   *
   */

  /**
   * connect
   * Este método será el que la aplicación utilice para obtener la información del estado de conexion a internet del dispositivo.
   * tipo: string: este pararametro sera el tipo de conexión (WIFI , CELL_2G , CELL_3G, CELL_4G) que la aplicación utilizara para poder realizar eventos o obtener información respecto a la conexión de internet
   */

  public connect(tipo: string): Observable<any> {
    return new Observable(observer => {
      this.network.onConnect().subscribe(status => {
        console.log('network connected!', status);
        //  if (this.network.type) {
        if (status) {
          this.signal = this.network.type;
          observer.next(this.signal);
        } else {
          this.disconnect();
        }
        // observer.complete();
      });
    });
  }

  public disconnect(): Observable<any> {
    return new Observable(observer => {
      this.network.onDisconnect().subscribe(status => {
          this.signal = status;
          observer.next(this.signal);
      });
    });
  }

  /**
   * Diagnostic:
   *Aqui se encuntran los metodos referentes al diagnostico de la camara del dispositivo
   *
   */

  /**
   * Diagnostic Option web
   * Este método será el que la aplicación utilice para comprobar si el hardware de la cámara está presente en el dispositivo en web.
   */

  private cameraWeb(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          devices.forEach(device => {
            //device.kind === 'audioinput' for audio
            if (device.kind === 'videoinput') {
              console.log('Camera:', true);
              resolve(true);
            }
          });
        })
        .catch(err => {
          console.log('Este dispositivo no tiene una camara');
        });
    });
  }
  /**
   * diagnosticoCamara() llamara los metodos de camaraPresent( ) y de cameraWeb() y separa su uso metiante
   * plaform tanto para web como para mobile
   *
   * Este método será el que la aplicación utilice para comprobar si el hardware de la cámara está presente en el dispositivo en web o en nativo
   */

  public diagnosticoCamara(): Promise<any> {
    return new Promise<any>(resolve => {
      console.log('antes', resolve);
      if (this.platform.is('cordova')) {
        console.log('despues', resolve);
        resolve(this.camaraPresent());
      } else resolve(this.cameraWeb());
    });
  }

  /**
   * Diagnostic Option
   * Este método será el que la aplicación utilice para comprobar si el dispositivo tiene una cámara. En Android, esto se cumple si el dispositivo tiene una cámara. En iOS, esto se cumple si el dispositivo tiene una cámara Y la aplicación está autorizada para usarla.
   */
  private camaraAvailable(): Promise<any> {
    return new Promise<any>(resolve => {
      if (this.platform.is('cordova') === true) {
        this.diagnostic
          .isCameraAvailable()
          .then(res => resolve(res))
          .catch(err =>
            console.error('Se ha producido un error en camaraAvailable: ', err)
          );
      } else this.cameraWeb();
    });
  }

  /**
   * camaraPresent()
   * Este método será el que la aplicación utilice para comprobar si el hardware de la cámara está presente en el dispositivo en web o en nativo
   */
  private camaraPresent(): Promise<any> {
    return new Promise<any>(resolve => {
      this.diagnostic
        .isCameraPresent()
        .then(res => {
          resolve(res);
        })
        .catch(err =>
          console.error('Se ha producido un error en  camaraPresent: ', err)
        );
    });
  }

  /**
   * camaraAuthorized()
   * Este método será el que la aplicación utilice para comprobar si la aplicación está autorizada para usar la cámara
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
   * Cameara AuthorizedStatus()
   * Este método será el que la aplicación utilice para devolver el estado de autorización de la cámara para la aplicación.
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
   * requestCamera()
   * Solicita autorización de cámara para la aplicación
   */

  public requestCamera(): Promise<any> {
    return new Promise<any>(resolve => {
      this.diagnostic
        .requestCameraAuthorization()
        .then(res => {
          console.log('sss', res);
          resolve(res);
        })
        .catch(err =>
          console.error('Se ha producido un error en  requestCamera: ', err)
        );
    });
  }
}
