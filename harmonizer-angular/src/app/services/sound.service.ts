import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  private audioContext = new (window['AudioContext'])();
  private analyzerNode = new AnalyserNode(this.audioContext, { fftSize: 1024 })
}
