# tcp-mitm

TCP MITM Proxy with a web-based monitoring interface

## Usage

```bash
npm install -g
vi .env
tcp-mitm [env-file]
```

You can define the required environment variables, but it will also load the provided env-file by argument. This parameter is optional and defaults to `.env` in the current working directory.

Please go to the [dotenv](https://www.npmjs.com/package/dotenv) package page for further instructions on the envfile format.

## Required environment variables

- `LISTEN_TCP_IP`
- `LISTEN_TCP_PORT`
- `FORWARD_TCP_IP`
- `FORWARD_TCP_PORT`
- `LISTEN_WEB_IP`
- `LISTEN_WEB_PORT`


