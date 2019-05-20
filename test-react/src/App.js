import React, {Component} from 'react';
import {Subject} from 'rxjs';
import {buffer, filter} from 'rxjs/operators';
import './App.css';
import Test from './test.js';

const stdOut$ = new Subject();
const stdErr$ = new Subject();
const stdOutFinished$ = stdOut$.pipe(filter(a => a === 10));
const stdErrFinished$ = stdErr$.pipe(filter(a => a === 10));
const bufferedStdOut$ = stdOut$.pipe(buffer(stdOutFinished$));
const bufferedStdErr$ = stdErr$.pipe(buffer(stdErrFinished$));

bufferedStdOut$.subscribe(v => console.log(v.map(String.fromCharCode).join('')));
bufferedStdErr$.subscribe(v => console.warn(v.map(String.fromCharCode).join('')));


Test({
  MEMFS : [{name: 'main.c', data: ''}],
  arguments: [],
  stdout: v => stdOut$.next(v),
  stderr: v => stdErr$.next(v),
  cb: function(files) {
    alert(JSON.stringify(files));
  }
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
