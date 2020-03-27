import { Component, OnInit } from '@angular/core';
import { DevicesStateService } from '../device/devices-state.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  level: any;
  batteryLevel: any = {lvl: 65, plug: false};
  network: any;
  nivel = 65;
  wifi = 'wifi';
  authorization: any;
  camRq: any;
  camPre: any;

  constructor(
      private deviceService: DevicesStateService,
      private camera: Camera,
  ) {
    console.log('constructor');
  }

  ngOnInit() {
    this.check();
    this.listen();
  }

  //////////////////////////////////////////// BATERIA/////////////////////////////////////////////////
  check() {
    this.deviceService.checkBattery1(this.batteryLevel).subscribe(res => {
      console.log('NUEVA BATERIA', res.lvl);
      if (res.lvl > this.nivel && res.plug == false) {
        this.alertBattery();
      } else if (res.lvl < this.nivel && res.plug == false) {
        console.warn('performace de 50% en esta aplicación');
        this.alertLowBattery();
      }
    });
  }


  alertBattery() {
    const elem = document.getElementById('bt');
    elem.classList.add('noShow');
    elem.classList.remove('show');
    const elemt = document.getElementById('fotografia');
    elemt.classList.remove('steal');
    elemt.classList.add('noSteal');
  }


  alertLowBattery() {
    const elem = document.getElementById('bt');
    elem.classList.remove('noShow');
    elem.classList.add('show');
    const elemt = document.getElementById('fotografia');
    elemt.classList.add('steal');
    elemt.classList.remove('noSteal');
  }


  stopBatteryCheck() {
    this.deviceService
        .stopBatteryCheck()
        .subscribe(res => console.log('desde componente stop', res));
  }

  ////////////////////////////////////////////// CÄMARA/////////////////////////////////////////////////


  camaraPreset() {
    this.deviceService
        .diagnosticoCamara()
        .then(res => {
          this.camPre = res;
          console.log('camaraPreset():', res);
        });
  }

  camaraAuth() {
    this.deviceService.camaraAuthorized().then(res => {
      this.authorization = res;
      alert('Camara authorized in this app:' + '' + res);
    });
  }

  camaraR() {
    this.deviceService
        .requestCamera()
        .then(res => {
          this.camRq = res;
          console.log('camaraR():', res);
        });
  }

  foto() {
    this.deviceService.diagnosticoCamara().then(res => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      if (res === true) {
        this.camera.getPicture(options).then(
            imageData => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64 (DATA_URL):
              const base64Image = 'data:image/jpeg;base64,' + imageData;
            },
            err => {
              // Handle error
            }
        );
      } else {
        console.log('no se puede usar la camra ');
      }
    });
  }

  ////////////////////////////////////////////// NETWORK/////////////////////////////////////////////////

  nets() {
    const el = document.getElementById('network-status');
    el.classList.remove('wifiOff', 'invi');
    el.classList.add('wifiOn');
  }

  noNet() {
    const el = document.getElementById('network-status');
    el.classList.remove('wifiOn', 'invi');
    el.classList.add('wifiOff');
  }

  listen() {
    this.deviceService.connectChange().subscribe(informacion => {
      if (informacion !== 'none') {
        console.log('cual es tu conexion:', informacion);
        this.nets();
      } else {
        this.disconnect();
        this.noNet();
      }
    });
  }

  disconnect() {
    this.deviceService.disconnect().subscribe(res => {
      alert('haz perdido tu conexion');
    });
  }
}
