export class BaseBuffer {
  protected _buff: ArrayBuffer = new ArrayBuffer(8192);
  protected _position: number = 0;
  protected _length: number = 0;

  constructor(data?: ArrayBuffer) {
    if (data) {
      this._buff = data;
      this._length = data.byteLength;
    }
  }

  public get buff() {
    return this._buff;
  }

  public get position() {
    return this._position;
  }

  public get length() {
    return this._length;
  }

  public canRead(length: number): boolean {
    return length + this._position < this._buff.byteLength;
  }

  public atEnd(): boolean {
    return this._position >= this._buff.byteLength;
  }

  public slice(length: number, position: number = -1): ArrayBuffer {
    if (position > 0) {
      return this._buff.slice(position, position + length);
    }
    this._position += length;
    return this._buff.slice(this._position - length, this._position);
  }

  public toArrayBuffer() {
    return this._buff.slice(0, this._length);
  }
}
