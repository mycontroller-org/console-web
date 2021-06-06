# MyController v2.x Web Console
This project has web console source code for the MyController server. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Setup development environment
To setup the development environment you need to run the [backend server](https://github.com/mycontroller-org/backend) locally or somewhere else, should be accessible from your computer.<br>

By default it looks the backend server on `http://localhost:8080` and websocket on `ws://localhost:8080`.<br>
You can update the following environment variables to point your backend,

*   `MC_PROXY_HTTP` - backend http url, default: `http://localhost:8080`
*   `MC_PROXY_WEBSOCKET` - backend websocket url, default `ws://localhost:8080`

```bash
# to update the backend server details in linux
export MC_PROXY_HTTP="http://192.168.1.21:8080"
export MC_PROXY_WEBSOCKET="ws://192.168.1.21:8080"
```

## Available Scripts
In the project directory, you can run:

### `yarn start`
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`
Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

## Release
There is no separate release for this project. The [backend repository](https://github.com/mycontroller-org/backend) takes the corresponding version(`tag`, `branch`) of this project and builds along with the backend code.
