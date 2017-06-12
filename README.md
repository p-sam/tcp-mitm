# tcp-mitm

TCP MITM Proxy with a web-based monitoring interface

## Usage

```bash
npm install -g
vi .env
tcp-mitm
```

You can define the required environment variables, but it will also load the `.env` file from the current working directory.

## Required environment variables

- `LISTEN_TCP_IP`
- `LISTEN_TCP_PORT`
- `FORWARD_TCP_IP`
- `FORWARD_TCP_PORT`
- `LISTEN_WEB_IP`
- `LISTEN_WEB_PORT`


