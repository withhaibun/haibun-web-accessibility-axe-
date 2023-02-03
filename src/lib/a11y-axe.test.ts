import axios from 'axios';
import { readFileSync } from 'fs';
import { createServer } from 'http';
import { evalSeverity, getReport } from './a11y-axe.js';

class TestHttpServer {
    server: any;
    constructor() {
        this.server = createServer(async (req, res) => {
            if (req.url == '/passes.html') {
                const contents = readFileSync('./files/test/passes.html', 'utf-8');
                res.writeHead(200);
                res.end(contents)
            } 
            else {
                throw Error(`no such path ${req.url}`)
                res.end(404);
            }
        });
    }
    listen() {
        this.server.listen(8080, 'localhost');
    }
    close() {
        this.server.close();
    }
}

jest.setTimeout(30000);
let server = new TestHttpServer();

describe('test audits with local server ', () => {
    beforeAll(async () => {
        await server.listen();
        console.debug('server started');
    });
    afterAll(async () => {
        await server.close();
        console.debug('closed server');
    });
    it('gets test contents', async () => {
        const DOCTYPE = '<!DOCTYPE HTML>';
        const response = await axios.get('http://localhost:8080/passes.html');
        expect(response.data.substr(0, DOCTYPE.length)).toEqual(DOCTYPE);
    });
    it('passes', async () => {
        const uri = 'http://localhost:8080/passes.html';
        const res = await evalSeverity(uri); 
        const res = await getReport(uri);
        expect(res.ok);
    }); 
})