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

export function isString (o: unknown): o is string {
  return typeof o === 'string'
}

export function isUndefined (o: unknown): o is undefined {
  return typeof o === 'undefined'
}

export function isNull (o: unknown): o is null {
  return o === null
}

export function isObject<T> (o: unknown): o is T {
  return o !== null && typeof o === 'object'
}

export function isBoolean (o: unknown): o is boolean {
  return o === true || o === false
}

export function isFunction (o: unknown): o is (...args: any[]) => any {
  return typeof o === 'function'
}

export function isNumber (o: unknown): o is number {
  return typeof o === 'number'
}

export function isBooleanStringLiteral (o: unknown): o is string {
  return o === 'true' || o === 'false'
}

export const isArray = Array.isArray
