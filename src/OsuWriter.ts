import { BaseBuffer } from "./BaseBuffer";

export class OsuWriter extends BaseBuffer {
  public writeUint8(value: number): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setUint8(this._position, value);
    this._position += 1;
    this._length += 1;
    return this;
  }

  public writeInt8(value: number): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setInt8(this._position, value);
    this._position += 1;
    this._length += 1;
    return this;
  }

  public writeUint16(value: number): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setUint16(this._position, value, true);
    this._position += 2;
    this._length += 2;
    return this;
  }

  public writeInt16(value: number): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setInt16(this._position, value, true);
    this._position += 2;
    this._length += 2;
    return this;
  }

  public writeUint32(value: number): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setUint32(this._position, value, true);
    this._position += 4;
    this._length += 4;
    return this;
  }

  public writeInt32(value: number): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setInt32(this._position, value, true);
    this._position += 4;
    this._length += 4;
    return this;
  }

  public writeUint64(value: bigint): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setBigUint64(this._position, value, true);
    this._position += 8;
    this._length += 8;
    return this;
  }

  public writeInt64(value: bigint): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setBigInt64(this._position, value, true);
    this._position += 8;
    this._length += 8;
    return this;
  }

  public write7bitInt(value: number): OsuWriter {
    let arr = [];
    let len = 0;
    do {
      arr[len] = value & 0x7f;
      if ((value >>= 7) !== 0) arr[len] |= 0x80;
      len++;
    } while (value > 0);

    const dataView = new Uint8Array(this._buff, this._position, arr.length);
    dataView.set(arr);

    this._position += arr.length;
    this._length += arr.length;

    return this;
  }

  public writeString(value: string): OsuWriter {
    if (!value || value.length === 0) {
      this.writeUint8(0);
    } else {
      this.writeUint8(11);
      this.write7bitInt(value.length);
      const dataView = new Uint8Array(this._buff, this._position, value.length);
      for (let i = 0; i < value.length; i++) {
        dataView[i] = value.charCodeAt(i);
      }

      this._position += value.length;
      this._length += value.length;
    }
    return this;
  }

  public writeFloat(value: number): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setFloat32(this._position, value, true);
    this._position += 4;
    this._length += 4;
    return this;
  }

  public writeDouble(value: number): OsuWriter {
    const dataView = new DataView(this._buff);
    dataView.setFloat64(this._position, value, true);
    this._position += 8;
    this._length += 8;
    return this;
  }

  public writeBoolean(value: boolean): OsuWriter {
    return this.writeUint8(value ? 1 : 0);
  }

  public writeBytes(values: number[]): OsuWriter {
    for (const v of values) {
      this.writeUint8(v);
    }
    return this;
  }

  public writeInt32Array(values: number[]): OsuWriter {
    this.writeInt16(values.length);
    for (const v of values) {
      this.writeInt32(v);
    }
    return this;
  }

  public writeInt32DoublePair(values: Map<number, number>): OsuWriter {
    this.writeInt32(values.size);
    for (const [k, v] of values.entries()) {
      this.writeInt32(k);
      this.writeDouble(v);
    }
    return this;
  }

  public writeDateTime(value: Date): OsuWriter {
    const data = BigInt(value.getTime() * 10000) + BigInt("621355968000000000");

    this.writeUint64(data);
    return this;
  }
}
