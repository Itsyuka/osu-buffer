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
     * @returns {Number}
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
     * @param {Number} length
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
     * @return {Number|undefined}
     */
    Peek() {
        return this.buffer[this.position+1];
    }

    /**
     * Reads a byte from the buffer
     * Does the same thing as ReadUInt8()
     * @return {Number}
     */
    ReadByte() {
        return this.ReadUInt8();
    }

    /**
     * Reads a signed integer from the Buffer
     * @param {Number} byteLength
     * @return {Number}
     */
    ReadInt(byteLength) {
        this.position += byteLength;
        return this.buffer.readIntLE(this.position - byteLength, byteLength);
    }

    /**
     * Reads a unsigned integer from the Buffer
     * @param {Number} byteLength
     * @return {Number}
     */
    ReadUInt(byteLength) {
        this.position += byteLength;
        return this.buffer.readUIntLE(this.position - byteLength, byteLength);
    }

    /**
     * Reads a 8-bit signed integer from the buffer
     * @return {Number}
     */
    ReadInt8() {
        return this.ReadInt(1);
    }

    /**
     * Reads a 8-bit unsigned integer from the buffer
     * @return {Number}
     */
    ReadUInt8() {
        return this.ReadUInt(1);
    }

    /**
     * Reads a 16-bit signed integer from the buffer
     * @return {Number}
     */
    ReadInt16() {
        return this.ReadInt(2);
    }

    /**
     * Reads a 16-bit unsigned integer from the buffer
     * @return {Number}
     */
    ReadUInt16() {
        return this.ReadUInt(2);
    }

    /**
     * Reads a 32-bit signed integer from the buffer
     * @return {Number}
     */
    ReadInt32() {
        return this.ReadInt(4);
    }

    /**
     * Reads a 32-bit signed unsigned from the buffer
     * @return {Number}
     */
    ReadUInt32() {
        return this.ReadUInt(4);
    }

    /**
     * Reads a 64-bit signed integer from the buffer
     * @return {Number}
     */
    ReadInt64() {
        return (this.ReadInt(4) << 8) + this.ReadInt(4);
    }

    /**
     * Reads a 64-bit signed unsigned from the buffer
     * @return {Number}
     */
    ReadUInt64() {
        return (this.ReadUInt(4) << 8) + this.ReadUInt(4);
    }

    /**
     * Reads a 32-bit Float from the buffer
     * @returns {Number}
     */
    ReadFloat() {
        this.position += 4;
        return this.buffer.readFloatLE(this.position - 4);
    }

    /**
     * Reads a 64-bit Double from the buffer
     * @returns {Number}
     */
    ReadDouble() {
        this.position += 8;
        return this.buffer.readDoubleLE(this.position - 8);
    }

    /**
     * Reads a string from the buffer
     * @param {Number} length
     * @returns {String}
     */
    ReadString(length) {
        return this.Slice(length, false).toString();
    }

    /**
     * Decodes a 7-bit encoded integer from the buffer
     * @returns {Number}
     */
    ReadVarint() {
        let total = 0;
        let shift = 0;
        let byte = this.ReadUInt8();
        if((byte & 0x80) === 0) {
            total |= ((byte & 0x7F) << shift);
        } else {
            let end = false;
            do {
                if(shift) {
                    byte = this.ReadUInt8();
                }
                total |= ((byte & 0x7F) << shift);
                if((byte & 0x80) === 0) end = true;
                shift += 7;
            } while (!end);
        }

        return total;
    }

    /**
     * Decodes a 7-bit encoded integer from the buffer
     * @deprecated Use ReadVarint instead
     * @returns {Number}
     */
    ReadULeb128() {
        return this.ReadVarint();
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
            let len = this.ReadVarint();
            return this.ReadString(len);
        } else {
            return '';
        }
    }

    // Writing

    /**
     * Concats a buffer to the current buffer
     * @param {Buffer} value
     * @return {OsuBuffer}
     */
    WriteBuffer(value) {
        this.buffer = Buffer.concat([this.buffer, value]);
        return this;
    }

    /**
     * Writes an unsinged integer of any byte length
     * @param {Number} value
     * @param {Number} byteLength
     * @return {OsuBuffer}
     */
    WriteUInt(value, byteLength) {
        let buff = Buffer.alloc(byteLength);
        buff.writeUIntLE(value, 0, byteLength);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes an integer of any byte length
     * @param {Number} value
     * @param {Number} byteLength
     * @return {OsuBuffer}
     */
    WriteInt(value, byteLength) {
        let buff = Buffer.alloc(byteLength);
        buff.writeIntLE(value, 0, byteLength);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes a 8-bit integer to the Buffer
     * @param {Number} value
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
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteUInt8(value) {
        return this.WriteUInt(value, 1);
    }

    /**
     * Writes a 8-bit integer to the Buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteInt8(value) {
        return this.WriteInt(value, 1);
    }

    /**
     * Writes a 16-bit unsigned integer to the Buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteUInt16(value) {
        return this.WriteUInt(value, 2);
    }

    /**
     * Writes a 16-bit signed integer to the Buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteInt16(value) {
        return this.WriteInt(value, 2);
    }

    /**
     * Writes a 32-bit unsigned integer to the Buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteUInt32(value) {
        return this.WriteUInt(value, 4);
    }

    /**
     * Writes a 32-bit signed integer to the Buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteInt32(value) {
        return this.WriteInt(value, 4);
    }

    /**
     * Writes a 64-bit unsigned integer to the Buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteUInt64(value) {
        let buff = Buffer.alloc(8);
        // High
        buff.writeUInt32LE(value >> 8, 0);
        // Low
        buff.writeUInt32LE(value & 0x00ff, 4);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes a 64-bit signed integer to the Buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteInt64(value) {
        let buff = Buffer.alloc(8);
        // High
        buff.writeInt32LE(value >> 8, 0);
        // Low
        buff.writeInt32LE(value & 0x00ff, 4);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes a 32-bit float to the buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteFloat(value) {
        let buff = Buffer.alloc(4);
        buff.writeFloatLE(value, 0);

        return this.WriteBuffer(buff);
    }

    /**
     * Writes a 64-bit double to the buffer
     * @param {Number} value
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
        let buff = Buffer.alloc(Buffer.byteLength(value, 'utf8'));
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
            this.WriteVarint(Buffer.byteLength(value, 'utf8'));
            this.WriteString(value);
        }
        return this;
    }

    /**
     * Writes an unsigned 7-bit encoded integer to the Buffer
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteVarint(value) {
        let arr = [];
        let len = 0;
        do {
            arr[len] = value & 0x7F;
            if ((value >>= 7) !== 0) arr[len] |= 0x80;
            len++;
        } while (value > 0);

        return this.WriteBuffer(Buffer.from(arr));
    }

    /**
     * Writes an unsigned 7-bit encoded integer to the Buffer
     * @deprecated Use WriteUVarint instead
     * @param {Number} value
     * @return {OsuBuffer}
     */
    WriteULeb128(value) {
        return this.WriteVarint(value);
    }
}

module.exports = OsuBuffer;
