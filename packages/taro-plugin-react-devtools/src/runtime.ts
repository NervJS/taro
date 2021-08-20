/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import WebSocket from './websocket'
const { connectToDevTools } = require('./backend')

declare const __REACT_DEVTOOLS_PORT__: number

const ws = new WebSocket(`ws://127.0.0.1:${__REACT_DEVTOOLS_PORT__}`)

connectToDevTools({
  // host: string (defaults to "localhost") - Websocket will connect to this host.
  port: __REACT_DEVTOOLS_PORT__, // number (defaults to 8097) - Websocket will connect to this port.
  // useHttps: boolean (defaults to false) - Websocket should use a secure protocol (wss).
  websocket: ws // Custom websocket to use. Overrides host and port settings if provided.
})
