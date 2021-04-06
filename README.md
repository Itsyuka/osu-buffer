# osu-buffer [![npm version](https://badge.fury.io/js/osu-buffer.svg)](https://badge.fury.io/js/osu-buffer) [![CodeFactor](https://www.codefactor.io/repository/github/itsyuka/osu-buffer/badge)](https://www.codefactor.io/repository/github/itsyuka/osu-buffer)

This package allows you to create a buffer that allows the readability of the packets or files of the game called osu!

This does not automagically convert it, you do need to put some work to make it possible.

## How to use
#### Require the package
```ecmascript 6
const { OsuReader, OsuWriter } = require('osu-buffer')
```

#### Creating a new OsuReader from Node buffer
```ecmascript 6
let buffer = Buffer.from([]);
let reader = new OsuReader(buffer.buffer);
```

#### Creating a new OsuReader from String
```ecmascript 6
let reader = OsuReader.fromString("");
```

#### Creating a new OsuWriter
```ecmascript 6
let write = new OsuWriter(); // Can be empty or ArrayBuffer
```

## License
MIT License

Copyright (c) 2021 Dillon Modine-Thuen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
