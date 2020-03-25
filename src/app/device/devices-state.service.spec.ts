import { TestBed } from '@angular/core/testing';
import { DevicesStateService } from './devices-state.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

let cordova: boolean = true;
class CameraMock {
  public requestCameraAuthorization(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve('GRANTED');
    });
  }

  public isCameraAuthorized(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(cordova);
    });
  }

  public isCameraPresent(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ('cordova') {
        resolve(true);
      }
    });
  }

}




const platformMock = {
  is: (platform) => {
  switch (platform) {
  case 'cordova':
  return true;
    default:
    return false;
  }
  }
 }



describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        BatteryStatus,
        Network,
        { provide: Diagnostic, useClass: CameraMock },
        {provide: Platform, useValue: platformMock}
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call requestCamera method', async () => {
    let res = await service.requestCamera();
    console.log(res);
    expect(res).toEqual('GRANTED');
  });

  it('call diagnosticoCamara method for MOBILE', async () => {
    let ress = await service.diagnosticoCamara();
    console.log('diagnosticoCamara()', ress);
    expect(ress).toEqual(true);
  });

  it('call camaraAuthorized method for MOBILE', async () => {
    let ress = await service.camaraAuthorized();
    console.log('camaraAuthorized()', ress);
    expect(ress).toEqual(true);
  });
});


describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        BatteryStatus,
        Network,
        { provide: Diagnostic, useClass: CameraMock },
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('call diagnosticoCamara for web', async () => {
    let ress = await service.diagnosticoCamara();
    console.log('diagnosticoCamara()', ress);
    expect(ress).toEqual(true);
  });

});

let m = 'offline';
let signal: string = 'wifi';

class NetworkMock {
  public onConnect(): Observable<any> {
    return new Observable(observer => {
      observer.next('wifi');
      // observer.complete();
    });
  }

  public onDisconnect(): Observable<any> {
    return new Observable(observer => {
      observer.next('offline');
      // observer.complete();
    });
  }
}

describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        BatteryStatus,
        Diagnostic,
        { provide: Network, useClass: NetworkMock }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call connect method for NETWORK', async () => {
    await service.connect('wifi').subscribe(observer => {
      expect(observer.next(signal)).toEqual('wifi');
    });
  });

  it('call disconnect for NETWORK', async () => {
    await service.disconnect().subscribe(observer => {
      console.log('disconect',observer)
      let a = observer;
     expect(a).toEqual('offline');
    });
  });
});

class NetworkMockElse {
  public onConnect(): Observable<any> {
    return new Observable(observer => {
      observer.next();
      // observer.complete();
    });
  }

  // public onDisconnect(): Observable<any> {
  //   return new Observable(observer => {
  //     observer.next('offline');
  //     // observer.complete();
  //   });
  // }
}

describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        BatteryStatus,
        Diagnostic,
        { provide: Network, useClass: NetworkMockElse }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call connect', async () => {
    await service.connect('3g').subscribe(observer => {
      expect(observer.next('3g')).toEqual('3g');
    });
  });
});

let lvl: number = 75;

class BatteryStatusMock {
  public onChange(): Observable<any> {
    return new Observable(observer => {
        observer.next(75);
        observer.complete();
    });
  }

  public onDisconnect(): Observable<any> {
    return new Observable(observer => {
      observer.next(undefined);
    });
  }
}

describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        Network,
        Diagnostic,
        { provide: BatteryStatus, useClass: BatteryStatusMock }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call checkBattery', async () => {
    await service.checkBattery1(lvl).subscribe(observer => {
      expect(observer.next(lvl)).toEqual(75);
    });
  });

  it('call stopBatteryCheck', async () => {
    await service.stopBatteryCheck().subscribe(observer => {
      expect(observer.next(undefined)).toEqual(undefined);
    });
  });
});


class BatteryStatusMockElse {
  public onChange(): Observable<any> {
    return new Observable(observer => {
        observer.next();
        observer.complete();
    });
  }

  public onDisconnect(): Observable<any> {
    return new Observable(observer => {
      observer.next(undefined);
    });
  }
}
describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        Network,
        Diagnostic,
        { provide: BatteryStatus, useClass: BatteryStatusMockElse }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call checkBattery', async () => {
    await service.checkBattery1(lvl).subscribe(observer => {
      expect(observer.next(lvl)).toEqual(75);
    });
  });

  it('call stopBatteryCheck', async () => {
    await service.stopBatteryCheck().subscribe(observer => {
      expect(observer.next(undefined)).toEqual(undefined);
    });
  });
});

