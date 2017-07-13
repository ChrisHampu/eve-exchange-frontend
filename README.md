# EVE Exchange Server & Client
This is a React frontend for visualizing realtime market data for EVE Online. It supports user profiles through the OAuth with the EVE API, a market browser, personalizable realtime charts, notifications, alerts, tickers, and more. This application is supported by the backend which does continuous aggregation and pushes updates via DeepStream for updating the client.

## Usage
This repository has a gitlab ci file for & uses Distelli for managing deployment.

Build the client:
```
npm run build
```

Start development server with live reload
```
npm start
```

Build server
```
NODE_ENV=production babel server -d build-server
```

## Technology
Realtime pub/sub makes use of a Deepstream client & server.
The frontend uses Material UI & PostCSS for the core of the design.

## Author
Christopher Hampu

## License
MIT
