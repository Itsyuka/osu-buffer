'use strict';

class OsuBuffer {
    /**
     * @param input
     */
    constructor(input) {
        this.buffer = Buffer.from((input instanceof Buffer) ? input : []);
        this.position = 0;
    }

    /**
     * Returns the full length of the buffer
     * @returns {number}
     */
    get length() {
        return this.buffer.length;
    }

    /**
     * Returns buffer to a binary string
     * @returns {String}
     */
    toString(type = 'binary') {
        return this.buffer.toString(type);
    }

    /**
     * Creates a new OsuBuffer from arguments
     * @returns {OsuBuffer}
     */
    static from() {
        if (arguments[0] instanceof OsuBuffer) {
            arguments[0] = arguments[0].buffer;
        }
        return new OsuBuffer(Buffer.from.apply(Buffer, arguments));
    }

    /**
     * Returns boolean if can read from defined length from buffer
     * @param {number} length
     * @return {boolean}
     */
    canRead(length) {
        return length + this.position <= this.buffer.length;
    }

    /**
     * Returns boolean if at end of the buffer
     * @return {boolean}
     */
    EOF() {
        return this.position >= this.buffer.length;
    }

    /**
     * Slices and returns buffer
     * @param {Number} length
     * @param {Boolean?} asOsuBuffer
     * @return {OsuBuffer|Buffer}
     */
    Slice(length, asOsuBuffer = true) {
        this.position += length;
        return asOsuBuffer ? OsuBuffer.from(this.buffer.slice(this.position - length, this.position))
            : this.buffer.slice(this.position - length, this.position);
    }

    // Reading

    /**
     * Peeks the next byte in the buffer without shifting the position
     * @return {number|undefined}
     */
    Peek() {
        return this.buffer[this.position+1];
    }

    /**
     * Reads a byte from the buffer
     * Does the same thing as ReadUInt8()
     * @return {number}
     */
    ReadByte() {
        return this.ReadUInt8();
    }

    /**
     * Reads a signed integer from the Buffer
     * @param byteLength
     * @return {number}
     */
    ReadInt(byteLength) {
        this.position += byteLength;
        return this.buffer.readIntLE(this.position - byteLength, byteLength);
    }

    /**
     * Reads a unsigned integer from the Buffer
     * @param byteLength
     * @return {number}
     */
    ReadUInt(byteLength) {
        this.position += byteLength;
        return this.buffer.readUIntLE(this.position - byteLength, byteLength);
    }

    /**
     * Reads a 8-bit signed integer from the buffer
     * @return {number}
     */
    ReadInt8() {
        return this.ReadInt(1);
    }

    /**
     * Reads a 8-bit unsigned integer from the buffer
     * @return {number}
     */
    ReadUInt8() {
        return this.ReadUInt(1);
    }

    /**
     * Reads a 16-bit signed integer from the buffer
     * @return {number}
     */
    ReadInt16() {
        return this.ReadInt(2);
    }

    /**
     * Reads a 16-bit unsigned integer from the buffer
     * @return {number}
     */
    ReadUInt16() {
        return this.ReadUInt(2);
    }

    /**
     * Reads a 32-bit signed integer from the buffer
     * @return {number}
     */
    ReadInt32() {
        return this.ReadInt(4);
    }

    /**
     * Reads a 32-bit signed unsigned from the buffer
     * @return {number}
     */
    ReadUInt32() {
        return this.ReadUInt(4);
    }

    /**
     * Reads a 64-bit signed integer from the buffer
     * @return {number}
     */
    ReadInt64() {
        return this.ReadInt(8);
    }

    /**
     * Reads a 64-bit signed unsigned from the buffer
     * @return {number}
     */
    ReadUInt64() {
        return this.ReadUInt(8);
    }

    /**
     * Reads a 32-bit Float from the buffer
     * @returns {number}
     */
    ReadFloat() {
        this.position += 4;
        return this.buffer.readFloatLE(this.position - 4);
    }

    /**
     * Reads a 64-bit Double from the buffer
     * @returns {number}
     */
    ReadDouble() {
        this.position += 8;
        return this.buffer.readDoubleLE(this.position - 8);
    }

    /**
     * Reads a string from the buffer
     * @param {number} length
     * @returns {String}
     */
    ReadString(length) {
        return this.Slice(length, false).toString();
    }

    /**
     * Decodes a 7-bit encoded integer from the buffer
     * @returns {number}
     */
    ReadULeb128() {
        let total = 0;
        let shift = 0;
        let len = 0;

        while (true) {
            let byte = this.buffer.readUInt8(this.position+len++);
            total |= ((byte & 0x7F) << shift);
            if((byte & 0x80) === 0) break;
            shift += 7;
        }

        this.position += len;

        return total;
    }

    /**
     * Reads a byte from buffer and converts to boolean
     * @return {boolean}
     */
    ReadBoolean() {
        return Boolean(this.ReadInt(1));
    }

    /**
     * Reads an osu! encoded string from the Buffer
     * @returns {string}
     */
    ReadOsuString() {
        let isString = this.ReadByte() === 11;
        if(isString) {
            let len = this.ReadULeb128();
            return this.ReadString(len);
        } else {
            return '';
        }
    }

    // Writing

    /**
     *
     * @param {Buffer} value
     * @return {OsuBuffer}
     */
    WriteBuffer(value) {
        this.buffer = Buffer.concat([this.buffer, value]);
        return this;
    }

    /**
     *
     * @param {number} value
     * @param {number} byteLength
     * @return {OsuBuffer}
     */
    WriteUInt(value, byteLength) {
        let buff = Buffer.alloc(byteLength);
        buff.writeUIntLE(value, 0, byteLength);

        return this.WriteBuffer(buff);
    }

    /**
     *
     * @param {number} value
     * @param {number} byteLength
     * @return {OsuBuffer}
     */
    WriteInt(value, byteLength) {
        let buff = Buffer.alloc(byteLength);
        buff.writeIntLE(value, 0, byteLength);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes a 8-bit integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteByte(value) {
        return this.WriteBuffer(Buffer.alloc(1, value));
    }

    /**
     *
     * @param {Array} value
     * @return {OsuBuffer}
     */
    WriteBytes(value) {
        return this.WriteBuffer(Buffer.from(value));
    }

    /**
     * Writes a 8-bit integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteUInt8(value) {
        return this.WriteUInt(value, 1);
    }

    /**
     * Writes a 8-bit integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteInt8(value) {
        return this.WriteInt(value, 1);
    }

    /**
     * Writes a 16-bit unsigned integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteUInt16(value) {
        return this.WriteUInt(value, 2);
    }

    /**
     * Writes a 16-bit signed integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteInt16(value) {
        return this.WriteInt(value, 2);
    }

    /**
     * Writes a 32-bit unsigned integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteUInt32(value) {
        return this.WriteUInt(value, 4);
    }

    /**
     * Writes a 32-bit signed integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteInt32(value) {
        return this.WriteInt(value, 4);
    }

    /**
     * Writes a 64-bit unsigned integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteUInt64(value) {
        return this.WriteUInt(value, 8);
    }

    /**
     * Writes a 64-bit signed integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteInt64(value) {
        return this.WriteInt(value, 8);
    }

    /**
     * Writes a 32-bit float to the buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteFloat(value) {
        let buff = Buffer.alloc(4);
        buff.writeFloatLE(value, 0);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes a 64-bit double to the buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteDouble(value) {
        let buff = Buffer.alloc(8);
        buff.writeDoubleLE(value, 0);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes a string to the Buffer
     * @param {string} value
     * @return {OsuBuffer}
     */
    WriteString(value) {
        let buff = Buffer.alloc(value.length);
        buff.write(value);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes a boolean to the buffer
     * @param {boolean} value
     * @return {OsuBuffer}
     */
    WriteBoolean(value) {
        return this.WriteByte(value ? 1 : 0);
    }

    /**
     * Writes an osu! encoded string to the Buffer
     * @param {string?} value
     * @param nullable
     * @return {OsuBuffer}
     */
    WriteOsuString(value, nullable = false) {
        if(value.length === 0 && nullable)
        {
            this.WriteByte(0);
        } else if(value.length === 0)
        {
            this.WriteByte(11);
            this.WriteByte(0);
        } else {
            this.WriteByte(11);
            this.WriteULeb128(value.length);
            this.WriteString(value);
        }
        return this;
    }

    /**
     * Writes an unsigned 7-bit encoded integer to the Buffer
     * @param {number} value
     * @return {OsuBuffer}
     */
    WriteULeb128(value) {
        let arr = [];
        let len = 0;
        let buff = Buffer.alloc(1);
        if(value > 0) {
            while (value > 0) {
                arr[len] = value & 0x7F;
                if (value >>= 7) arr[len] |= 0x80;
                len++;
            }
            buff = Buffer.from(arr);
        }

        return this.WriteBuffer(buff);
    }
}

module.exports = OsuBuffer;