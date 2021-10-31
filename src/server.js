"use strict";
import { createWriteStream } from 'fs';
import { createServer } from 'net';
function demultiplexChannel(src, destinations = []) {
    let currentChannel = null, currentLength = null;

    src
        .on('readable', () => {
            let chunk;
            if (currentChannel === null) {
                chunk = src.read(1)
                currentChannel = chunk && chunk.readUInt8(0)
            }
            if (currentLength === null) {
                chunk = src.read(4)
                currentLength = chunk && chunk.readUInt32BE(0)
                if (currentLength === null) {
                    return null;
                }
            }

            chunk = src.read(currentLength);
            if (chunk === null) {
                return null;
            }

            console.log(`Received packet from: ${currentChannel}`);
            destinations[currentChannel].write(chunk);
            currentChannel = null;
            currentLength = null;
        })
        .on('end', () => {
            destinations.forEach(dest => dest.end())
            console.log('Source channel closed');
        })
}

const server = createServer((socket) => {
    const stdoutStream = createWriteStream('stdout.log');
    const stderrStream = createWriteStream('stderr.log');
    demultiplexChannel(socket, [stdoutStream, stderrStream]);
})

server.listen(3000, () => console.log('Server Started'));