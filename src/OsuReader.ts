import { BaseBuffer } from "./BaseBuffer";

export class OsuReader extends BaseBuffer {
  public readUint8(): number {
    const dataView = new DataView(this._buff);
    const data = dataView.getUint8(this._position);
    this._position += 1;
    return data;
  }

  public readInt8(): number {
    const dataView = new DataView(this._buff);
    const data = dataView.getInt8(this._position);
    this._position += 1;
    return data;
  }

  public readUint16(): number {
    const dataView = new DataView(this._buff);
    const data = dataView.getUint16(this._position, true);
    this._position += 2;
    return data;
  }

  public readInt16(): number {
    const dataView = new DataView(this._buff);
    const data = dataView.getInt16(this._position, true);
    this._position += 2;
    return data;
  }

  public readUint32(): number {
    const dataView = new DataView(this._buff);
    const data = dataView.getUint32(this._position, true);
    this._position += 4;
    return data;
  }

  public readInt32(): number {
    const dataView = new DataView(this._buff);
    const data = dataView.getInt32(this._position, true);
    this._position += 4;
    return data;
  }

  public readUint64(): bigint {
    const dataView = new DataView(this._buff);
    const data = dataView.getBigUint64(this._position, true);
    this._position += 8;
    return data;
  }

  public readInt64(): bigint {
    const dataView = new DataView(this._buff);
    const data = dataView.getBigInt64(this._position, true);
    this._position += 8;
    return data;
  }

  public read7bitInt(): number {
    let total = 0;
    let shift = 0;
    let byte = this.readUint8();
    if ((byte & 0x80) === 0) {
      total |= (byte & 0x7f) << shift;
    } else {
      let end = false;
      do {
        if (shift) {
          byte = this.readUint8();
        }
        total |= (byte & 0x7f) << shift;
        if ((byte & 0x80) === 0) end = true;
        shift += 7;
      } while (!end);
    }

    return total;
  }

  public readString(): string | null {
    if (this.readUint8() === 0) {
      return null;
    }

    const length = this.read7bitInt();
    const buffView = new Uint8Array(this._buff, this._position, length);
    let value = "";
    for (const item of buffView) {
      value += String.fromCharCode(item);
    }

    this._position += length;
    this._length += length;

    return value;
  }

  public readFloat(): number {
    const dataView = new DataView(this._buff);
    const data = dataView.getFloat32(this._position, true);
    this._position += 4;
    return data;
  }

  public readDouble(): number {
    const dataView = new DataView(this._buff);
    const data = dataView.getFloat64(this._position, true);
    this._position += 8;
    return data;
  }

  public readBoolean(): boolean {
    return Boolean(this.readUint8());
  }

  public readBytes(length: number) {
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr[i] = this.readUint8();
    }
    return arr;
  }

  public readInt32Array(): number[] {
    const length = this.readInt16();
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr[i] = this.readInt32();
    }
    return arr;
  }

  public readInt32DoublePair(): Map<number, number> {
    const length = this.readInt32();
    const map = new Map<number, number>();
    for (let i = 0; i < length; i++) {
      this.readUint8();
      const key = this.readInt32();
      this.readUint8();
      const value = this.readInt32();
      map.set(key, value);
    }
    return map;
  }

  public readDateTime(): Date {
    const ticks = this.readUint64();
    let date = new Date(
      Number((ticks - BigInt("621355968000000000")) / BigInt(10000))
    );
    return date;
  }

  public static fromString(value: string): OsuReader {
    const buff = new ArrayBuffer(value.length);
    const buffView = new Uint8Array(buff);
    for (let i = 0; i < value.length; i++) {
      buffView[i] = value.charCodeAt(i);
    }
    return new OsuReader(buff);
  }
}
