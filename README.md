# osu-buffer [![npm version](https://badge.fury.io/js/osu-buffer.svg)](https://badge.fury.io/js/osu-buffer) [![CodeFactor](https://www.codefactor.io/repository/github/itsyuka/osu-buffer/badge)](https://www.codefactor.io/repository/github/itsyuka/osu-buffer)

This package allows you to create a buffer that allows the readability of the packets or files of the game called osu!

This does not automagically convert it, you do need to put some work to make it possible.

This doesn't include all required functions to read the .db files, although if someone would like to create a pull request
and implement those features, I would be very happy :)

## How to use
#### Require the package
```ecmascript 6
const osuBuffer = require('osu-buffer')
```

#### Creating a new OsuBuffer
```ecmascript 6
let buffer = new osuBuffer(); // You can supply a Node.js Buffer
                              // if you would like to read from that
```

### Functions
##### Buffer functions
|Function|Description|Param|Return|
|--------|-----------|-----|------|
| length | Returns the full length of the buffer | | `Number` |
| toString() | Returns buffer to a binary string | `String` type of return (default: binary) | `String` |
| from() | Creates a new OsuBuffer from arguments | | `OsuBuffer` |
| canRead() | Returns boolean if can read from defined length from buffer | `Number` length | `Boolean` |
| EOF() | Returns boolean if at end of the buffer | | `Boolean` |
| Slice() | Slices and returns buffer | `Number` length, `Boolean` as OsuBuffer | `Buffer` or `OsuBuffer` |

##### Read

|Function|Description|Param|Return|
|--------|-----------|-----|------|
| Peek() | Peeks the next byte in the buffer without shifting the position | | `Number` or `Undefined` |
| ReadByte() | Reads a byte from the provided Buffer | | `Number` |
| ReadInt() | Reads an integer of any byte length | `Number` length of bytes | `Number` |
| ReadUInt() | Reads an unsinged integer of any byte length | `Number` length of bytes | `Number` |
| ReadInt8() | Reads an 8-bit signed integer | | `Number` |
| ReadUInt8() | Reads an 8-bit unsigned integer | | `Number` |
| ReadInt16() | Reads an 16-bit signed integer | | `Number` |
| ReadUInt16() | Reads an 16-bit unsigned integer | | `Number` |
| ReadInt32() | Reads an 32-bit signed integer | | `Number` |
| ReadUInt32() | Reads an 32-bit unsigned integer | | `Number` |
| ReadInt64() | Reads an 64-bit signed integer | | `Number` |
| ReadUInt64() | Reads an 64-bit unsigned integer | | `Number` |
| ReadFloat() | Reads a 32-bit float | | `Number` |
| ReadDouble() | Reads a 64-bit float | | `Number` |
| ReadString() | Reads a unicode string | `Number` length of string | `String` |
| ReadOsuString() | Reads the osu! encoded string (uses varint for length) | | `String` |
| ReadVarint() | Reads an encoded variable integer | | `Number` |
| ReadBoolean() | Reads a boolean | | `Boolean` |

##### Write

|Function|Description|Param|
|--------|-----------|-----|
| WriteBuffer() | Concats a buffer to the current buffer | `Buffer` | 
| WriteByte() | Writes a byte from the provided Buffer | `Number` |
| WriteInt() | Writes an integer of any byte length | `Number` , `Number` Byte Length |
| WriteUInt() | Writes an unsinged integer of any byte length | `Number` , `Number` Byte Length |
| WriteInt8() | Writes an 8-bit signed integer | `Number` |
| WriteUInt8() | Writes an 8-bit unsigned integer | `Number` |
| WriteInt16() | Writes an 16-bit signed integer | `Number` |
| WriteUInt16() | Writes an 16-bit unsigned integer | `Number` |
| WriteInt32() | Writes an 32-bit signed integer | `Number` |
| WriteUInt32() | Writes an 32-bit unsigned integer | `Number` |
| WriteInt64() | Writes an 64-bit signed integer | `Number` |
| WriteUInt64() | Writes an 64-bit unsigned integer | `Number` |
| WriteFloat() | Writes a 32-bit float | `Number` |
| WriteDouble() | Writes a 64-bit float | `Number` |
| WriteString() | Writes a unicode string `String` |
| WriteOsuString() | Writes the osu! encoded string (uses varint for length) | `String` , `Boolean` nullable (only true for multiplayer matches) |
| WriteVarint() | Writes an encoded variable integer | `Number` |
| WriteBoolean() | Writes a boolean | `Boolean` |

## License
MIT License

Copyright (c) 2017 Dillon Modine-Thuen

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
