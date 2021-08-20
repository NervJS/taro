/*
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

import { sortRules } from './sortRules'

describe('sortRules', () => {
  it('should sort :export to be the last rule', () => {
    expect(
      sortRules([
        {
          type: 'rule',
          selectors: [':export'],
          declarations: [
            {
              type: 'declaration',
              property: 'foo',
              value: '1',
              position: {
                start: { line: 3, column: 9 },
                end: { line: 3, column: 15 }
              }
            }
          ],
          position: {
            start: { line: 2, column: 7 },
            end: { line: 4, column: 8 }
          }
        },
        {
          type: 'rule',
          selectors: ['.foo'],
          declarations: [
            {
              type: 'declaration',
              property: 'color',
              value: 'red',
              position: {
                start: { line: 7, column: 9 },
                end: { line: 7, column: 19 }
              }
            }
          ],
          position: {
            start: { line: 6, column: 7 },
            end: { line: 8, column: 8 }
          }
        }
      ])
    ).toEqual([
      {
        type: 'rule',
        selectors: ['.foo'],
        declarations: [
          {
            type: 'declaration',
            property: 'color',
            value: 'red',
            position: {
              start: { line: 7, column: 9 },
              end: { line: 7, column: 19 }
            }
          }
        ],
        position: {
          start: { line: 6, column: 7 },
          end: { line: 8, column: 8 }
        }
      },
      {
        type: 'rule',
        selectors: [':export'],
        declarations: [
          {
            type: 'declaration',
            property: 'foo',
            value: '1',
            position: {
              start: { line: 3, column: 9 },
              end: { line: 3, column: 15 }
            }
          }
        ],
        position: {
          start: { line: 2, column: 7 },
          end: { line: 4, column: 8 }
        }
      }
    ])

    expect(
      sortRules([
        {
          type: 'rule',
          selectors: ['.foo'],
          declarations: [
            {
              type: 'declaration',
              property: 'color',
              value: 'red',
              position: {
                start: { line: 7, column: 9 },
                end: { line: 7, column: 19 }
              }
            }
          ],
          position: {
            start: { line: 6, column: 7 },
            end: { line: 8, column: 8 }
          }
        },
        {
          type: 'rule',
          selectors: [':export'],
          declarations: [
            {
              type: 'declaration',
              property: 'foo',
              value: '1',
              position: {
                start: { line: 3, column: 9 },
                end: { line: 3, column: 15 }
              }
            }
          ],
          position: {
            start: { line: 2, column: 7 },
            end: { line: 4, column: 8 }
          }
        },
        {
          type: 'rule',
          selectors: ['.foo'],
          declarations: [
            {
              type: 'declaration',
              property: 'color',
              value: 'red',
              position: {
                start: { line: 7, column: 9 },
                end: { line: 7, column: 19 }
              }
            }
          ],
          position: {
            start: { line: 6, column: 7 },
            end: { line: 8, column: 8 }
          }
        }
      ])
    ).toEqual([
      {
        type: 'rule',
        selectors: ['.foo'],
        declarations: [
          {
            type: 'declaration',
            property: 'color',
            value: 'red',
            position: {
              start: { line: 7, column: 9 },
              end: { line: 7, column: 19 }
            }
          }
        ],
        position: {
          start: { line: 6, column: 7 },
          end: { line: 8, column: 8 }
        }
      },
      {
        type: 'rule',
        selectors: ['.foo'],
        declarations: [
          {
            type: 'declaration',
            property: 'color',
            value: 'red',
            position: {
              start: { line: 7, column: 9 },
              end: { line: 7, column: 19 }
            }
          }
        ],
        position: {
          start: { line: 6, column: 7 },
          end: { line: 8, column: 8 }
        }
      },
      {
        type: 'rule',
        selectors: [':export'],
        declarations: [
          {
            type: 'declaration',
            property: 'foo',
            value: '1',
            position: {
              start: { line: 3, column: 9 },
              end: { line: 3, column: 15 }
            }
          }
        ],
        position: {
          start: { line: 2, column: 7 },
          end: { line: 4, column: 8 }
        }
      }
    ])
  })

  it('should sort :export blocks to be after classes, but sorted by start line', () => {
    expect(
      sortRules([
        {
          type: 'rule',
          selectors: [':export'],
          declarations: [
            {
              type: 'declaration',
              property: 'bar',
              value: '1',
              position: {
                start: { line: 11, column: 3 },
                end: { line: 11, column: 9 }
              }
            },
            {
              type: 'declaration',
              property: 'bar',
              value: '2',
              position: {
                start: { line: 12, column: 3 },
                end: { line: 12, column: 9 }
              }
            }
          ],
          position: {
            start: { line: 10, column: 1 },
            end: { line: 13, column: 2 }
          }
        },
        {
          type: 'rule',
          selectors: ['.foo'],
          declarations: [
            {
              type: 'declaration',
              property: 'color',
              value: 'blue',
              position: {
                start: { line: 7, column: 3 },
                end: { line: 7, column: 14 }
              }
            }
          ],
          position: {
            start: { line: 6, column: 1 },
            end: { line: 8, column: 2 }
          }
        },
        {
          type: 'rule',
          selectors: [':export'],
          declarations: [
            {
              type: 'declaration',
              property: 'bar',
              value: '3',
              position: {
                start: { line: 3, column: 3 },
                end: { line: 3, column: 9 }
              }
            }
          ],
          position: {
            start: { line: 2, column: 1 },
            end: { line: 4, column: 2 }
          }
        }
      ])
    ).toEqual([
      {
        declarations: [
          {
            position: {
              end: { column: 14, line: 7 },
              start: { column: 3, line: 7 }
            },
            property: 'color',
            type: 'declaration',
            value: 'blue'
          }
        ],
        position: {
          end: { column: 2, line: 8 },
          start: { column: 1, line: 6 }
        },
        selectors: ['.foo'],
        type: 'rule'
      },
      {
        declarations: [
          {
            position: {
              end: { column: 9, line: 3 },
              start: { column: 3, line: 3 }
            },
            property: 'bar',
            type: 'declaration',
            value: '3'
          }
        ],
        position: {
          end: { column: 2, line: 4 },
          start: { column: 1, line: 2 }
        },
        selectors: [':export'],
        type: 'rule'
      },
      {
        declarations: [
          {
            position: {
              end: { column: 9, line: 11 },
              start: { column: 3, line: 11 }
            },
            property: 'bar',
            type: 'declaration',
            value: '1'
          },
          {
            position: {
              end: { column: 9, line: 12 },
              start: { column: 3, line: 12 }
            },
            property: 'bar',
            type: 'declaration',
            value: '2'
          }
        ],
        position: {
          end: { column: 2, line: 13 },
          start: { column: 1, line: 10 }
        },
        selectors: [':export'],
        type: 'rule'
      }
    ])
  })

  it('should do nothing with an empty array', () => {
    expect(sortRules([])).toEqual([])
  })
})
