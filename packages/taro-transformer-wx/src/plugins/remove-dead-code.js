/* eslint-disable */
// 修改自： https://github.com/babel/minify/blob/master/packages/babel-plugin-minify-dead-code-elimination/src/index.js
// 主要更改了 `toStatements` 函数，remove if statement 发生在 render JSX 函数时不生成 block statement
const { some } = require("lodash");
const { markEvalScopes, hasEval } = require("babel-helper-mark-eval-scopes");
const evaluate = require("babel-helper-evaluate-path");

function evaluateTruthy(path) {
  const res = evaluate(path);
  if (res.confident) return !!res.value;
}


function prevSiblings(path) {
  const parentPath = path.parentPath;
  const siblings = [];

  let key = parentPath.key;

  while ((path = parentPath.getSibling(--key)).type) {
    siblings.push(path);
  }
  return siblings;
}

function forEachAncestor(path, callback) {
  while ((path = path.parentPath)) {
    callback(path);
  }
}

function containJSXElement (path) {
  let matched = false
  path.traverse({
    JSXElement (p) {
      matched = true
      p.stop()
    }
  })
  return matched
}

module.exports = ({ types: t, traverse }) => {
  const removeOrVoid = require("babel-helper-remove-or-void")(t);
  const shouldRevisit = Symbol("shouldRevisit");

  // this is used for tracking fn params that can be removed
  // as traversal takes place from left and
  // unused params can be removed only on the right
  const markForRemoval = Symbol("markForRemoval");

  const main = {
    // remove side effectless statement
    ExpressionStatement(path) {
      if (path.get("expression").isPure()) {
        removeOrVoid(path);
      }
    },

    Function: {
      // Let's take all the vars in a function that are not in the top level scope and hoist them
      // with the first var declaration in the top-level scope. This transform in itself may
      // not yield much returns (or even can be marginally harmful to size). However it's great
      // for taking away statements from blocks that can be only expressions which the `simplify`
      // plugin can turn into other things (e.g. if => conditional).
      exit(path) {
        // This hurts gzip size.
        if (!this.optimizeRawSize) {
          return;
        }

        const { node, scope } = path;
        const seen = new Set();
        const declars = [];
        const mutations = [];
        for (const name in scope.bindings) {
          const binding = scope.bindings[name];
          if (!binding.path.isVariableDeclarator()) {
            continue;
          }

          const declarPath = binding.path.parentPath;
          if (seen.has(declarPath)) {
            continue;
          }
          seen.add(declarPath);

          if (declarPath.parentPath.isForInStatement()) {
            continue;
          }

          if (declarPath.parentPath.parentPath.isFunction()) {
            continue;
          }

          if (!declarPath.node || !declarPath.node.declarations) {
            continue;
          }

          const assignmentSequence = [];
          for (const declar of declarPath.node.declarations) {
            declars.push(declar);
            if (declar.init) {
              assignmentSequence.push(
                t.assignmentExpression("=", declar.id, declar.init)
              );
              mutations.push(() => {
                declar.init = null;
              });
            }
          }

          if (assignmentSequence.length) {
            mutations.push(() =>
              declarPath.replaceWith(t.sequenceExpression(assignmentSequence))
            );
          } else {
            mutations.push(() => removeOrVoid(declarPath));
          }
        }

        if (declars.length) {
          mutations.forEach(f => f());
          for (const statement of node.body.body) {
            if (t.isVariableDeclaration(statement)) {
              statement.declarations.push(...declars);
              return;
            }
          }
          const varDecl = t.variableDeclaration("var", declars);
          node.body.body.unshift(varDecl);
        }
      }
    },

    // Remove bindings with no references.
    Scope: {
      exit(path) {
        if (path.node[shouldRevisit]) {
          delete path.node[shouldRevisit];
          path.visit();
        }
      },

      enter(path) {
        if (path.isProgram()) {
          return;
        }

        if (hasEval(path.scope)) {
          return;
        }

        const { scope } = path;

        // if the scope is created by a function, we obtain its
        // parameter list
        const canRemoveParams = path.isFunction() && path.node.kind !== "set";
        const paramsList = canRemoveParams ? path.get("params") : [];

        for (let i = paramsList.length - 1; i >= 0; i--) {
          const param = paramsList[i];

          if (param.isIdentifier()) {
            const binding = scope.bindings[param.node.name];
            if (!binding) continue;

            if (binding.referenced) {
              // when the first binding is referenced (right to left)
              // exit without marking anything after this
              break;
            }

            binding[markForRemoval] = true;
            continue;
          } else if (param.isAssignmentPattern()) {
            const left = param.get("left");
            const right = param.get("right");

            if (left.isIdentifier() && right.isPure()) {
              const binding = scope.bindings[left.node.name];
              if (binding.referenced) {
                // when the first binding is referenced (right to left)
                // exit without marking anything after this
                break;
              }

              binding[markForRemoval] = true;
              continue;
            }
          }

          // other patterns - assignment, object have side-effects
          // and cannot be safely removed
          break;
        }

        for (const name in scope.bindings) {
          const binding = scope.bindings[name];

          if (!binding.referenced && binding.kind !== "module") {
            if (
              binding.kind === "param" &&
              (this.keepFnArgs || !binding[markForRemoval])
            ) {
              continue;
            } else if (binding.path.isVariableDeclarator()) {
              const declaration = binding.path.parentPath;
              const maybeBlockParent = declaration.parentPath;
              if (
                maybeBlockParent &&
                maybeBlockParent.isForXStatement({
                  left: declaration.node
                })
              ) {
                // Can't remove if in a for-in/for-of/for-await statement `for (var x in wat)`.
                continue;
              }
            } else if (!scope.isPure(binding.path.node)) {
              // TODO: AssignmentPattern are marked as impure and unused ids aren't removed yet
              continue;
            } else if (
              binding.path.isFunctionExpression() ||
              binding.path.isClassExpression()
            ) {
              // `bar(function foo() {})` foo is not referenced but it's used.
              continue;
            } else if (
              // ClassDeclaration has binding in two scopes
              //   1. The scope in which it is declared
              //   2. The class's own scope
              binding.path.isClassDeclaration() &&
              binding.path === scope.path
            ) {
              continue;
            }

            const mutations = [];
            let bail = false;
            // Make sure none of the assignments value is used
            binding.constantViolations.forEach(p => {
              if (bail || p === binding.path) {
                return;
              }

              if (!p.parentPath.isExpressionStatement()) {
                bail = true;
              }

              if (p.isAssignmentExpression()) {
                if (
                  t.isArrayPattern(p.node.left) ||
                  t.isObjectPattern(p.node.left)
                ) {
                  bail = true;
                } else if (p.get("right").isPure()) {
                  mutations.push(() => removeOrVoid(p));
                } else {
                  mutations.push(() => p.replaceWith(p.get("right")));
                }
              }
            });

            if (bail) {
              continue;
            }

            if (binding.path.isVariableDeclarator()) {
              if (!binding.path.get("id").isIdentifier()) {
                // deopt for object and array pattern
                continue;
              }

              // if declarator has some impure init expression
              // var x = foo();
              // => foo();
              if (
                binding.path.node.init &&
                !scope.isPure(binding.path.node.init) &&
                binding.path.parentPath.node.declarations
              ) {
                // binding path has more than one declarations
                if (binding.path.parentPath.node.declarations.length !== 1) {
                  continue;
                }
                binding.path.parentPath.replaceWith(binding.path.node.init);
              } else {
                updateReferences(binding.path, this);
                removeOrVoid(binding.path);
              }
            } else {
              updateReferences(binding.path, this);
              removeOrVoid(binding.path);
            }

            mutations.forEach(f => f());
            scope.removeBinding(name);
          } else if (binding.constant) {
            if (
              binding.path.isFunctionDeclaration() ||
              (binding.path.isVariableDeclarator() &&
                binding.path.get("init").isFunction())
            ) {
              const fun = binding.path.isFunctionDeclaration()
                ? binding.path
                : binding.path.get("init");
              let allInside = true;
              for (const ref of binding.referencePaths) {
                if (!ref.find(p => p.node === fun.node)) {
                  allInside = false;
                  break;
                }
              }

              if (allInside) {
                scope.removeBinding(name);
                updateReferences(binding.path, this);
                removeOrVoid(binding.path);
                continue;
              }
            }

            if (
              binding.references === 1 &&
              binding.kind !== "param" &&
              binding.kind !== "module" &&
              binding.constant
            ) {
              let replacement = binding.path.node;
              let replacementPath = binding.path;
              let isReferencedBefore = false;

              const refPath = binding.referencePaths[0];

              if (t.isVariableDeclarator(replacement)) {
                const _prevSiblings = prevSiblings(replacementPath);
                // traverse ancestors of a reference checking if it's before declaration
                forEachAncestor(refPath, ancestor => {
                  if (_prevSiblings.indexOf(ancestor) > -1) {
                    isReferencedBefore = true;
                  }
                });

                // deopt if reference is in different scope than binding
                // since we don't know if it's sync or async execution
                // (i.e. whether value has been assigned to a reference or not)
                if (isReferencedBefore && refPath.scope !== binding.scope) {
                  continue;
                }

                // simulate hoisting by replacing value
                // with undefined if declaration is after reference
                replacement = isReferencedBefore
                  ? t.unaryExpression("void", t.numericLiteral(0), true)
                  : replacement.init;

                // Bail out for ArrayPattern and ObjectPattern
                // TODO: maybe a more intelligent approach instead of simply bailing out
                if (!replacementPath.get("id").isIdentifier()) {
                  continue;
                }
                replacementPath = replacementPath.get("init");
              }

              if (!replacement) {
                continue;
              }

              if (!scope.isPure(replacement, true) && !isReferencedBefore) {
                continue;
              }

              let bail = false;

              if (replacementPath.isIdentifier()) {
                const binding = scope.getBinding(replacement.name);
                // the reference should be in the same scope
                // and the replacement should be a constant - this is to
                // ensure that the duplication of replacement is not affected
                // https://github.com/babel/minify/issues/685
                bail = !(
                  binding &&
                  refPath.scope.getBinding(replacement.name) === binding &&
                  binding.constantViolations.length === 0
                );
              } else {
                replacementPath.traverse({
                  Function(path) {
                    path.skip();
                  },

                  ReferencedIdentifier({ node }) {
                    if (bail) {
                      return;
                    }
                    const binding = scope.getBinding(node.name);
                    if (
                      binding &&
                      refPath.scope.getBinding(node.name) === binding
                    ) {
                      bail = binding.constantViolations.length > 0;
                    }
                  }
                });
              }

              if (bail) {
                continue;
              }

              let parent = binding.path.parent;
              if (t.isVariableDeclaration(parent)) {
                parent = binding.path.parentPath.parent;
              }

              // 1. Make sure we share the parent with the node. In other words it's lexically defined
              // and not in an if statement or otherwise.
              // 2. If the replacement is an object then we have to make sure we are not in a loop or a function
              // because otherwise we'll be inlining and doing a lot more allocation than we have to
              // which would also could affect correctness in that they are not the same reference.
              let mayLoop = false;
              const sharesRoot = refPath.find(({ node }) => {
                if (!mayLoop) {
                  mayLoop =
                    t.isWhileStatement(node) ||
                    t.isFor(node) ||
                    t.isFunction(node);
                }
                return node === parent;
              });

              // Anything that inherits from Object.
              const isObj = n =>
                t.isFunction(n) ||
                t.isObjectExpression(n) ||
                t.isArrayExpression(n);

              const isReplacementObj =
                isObj(replacement) || some(replacement, isObj);

              if (!sharesRoot || (isReplacementObj && mayLoop)) {
                continue;
              }

              // check if it's safe to replace
              // To solve https://github.com/babel/minify/issues/691
              // Here we bail for property checks using the "in" operator
              // This is because - `in` is a side-effect-free operation but the property
              // could be deleted between the replacementPath and referencePath
              // It is expensive to compute the delete operation and we bail for
              // all the binary "in" operations
              let inExpression = replacementPath.isBinaryExpression({
                operator: "in"
              });

              if (!inExpression) {
                replacementPath.traverse({
                  Function(path) {
                    path.skip();
                  },
                  BinaryExpression(path) {
                    if (path.node.operator === "in") {
                      inExpression = true;
                      path.stop();
                    }
                  }
                });
              }

              if (inExpression) {
                continue;
              }

              const replaced = replace(binding.referencePaths[0], {
                binding,
                scope,
                replacement,
                replacementPath
              });

              if (replaced) {
                scope.removeBinding(name);
                if (binding.path.node) {
                  removeOrVoid(binding.path);
                }
              }
            }
          }
        } // end-for-of
      }
    },

    // Remove unreachable code.
    BlockStatement(path) {
      const paths = path.get("body");

      let purge = false;

      for (let i = 0; i < paths.length; i++) {
        const p = paths[i];

        if (!purge && p.isCompletionStatement()) {
          purge = true;
          continue;
        }

        if (purge && !canExistAfterCompletion(p)) {
          removeOrVoid(p);
        }
      }
    },

    // Double check unreachable code and remove return statements that
    // have no semantic meaning
    ReturnStatement(path) {
      const { node } = path;
      if (!path.inList) {
        return;
      }

      // Not last in its block? (See BlockStatement visitor)
      if (
        path.container.length - 1 !== path.key &&
        !canExistAfterCompletion(path.getSibling(path.key + 1)) &&
        path.parentPath.isBlockStatement()
      ) {
        // This is probably a new oppurtinity by some other transform
        // let's call the block visitor on this again before proceeding.
        path.parentPath.pushContext(path.context);
        path.parentPath.visit();
        path.parentPath.popContext();

        return;
      }

      if (node.argument) {
        return;
      }

      let noNext = true;
      let parentPath = path.parentPath;
      while (parentPath && !parentPath.isFunction() && noNext) {
        // https://github.com/babel/minify/issues/265
        if (hasLoopParent(parentPath)) {
          noNext = false;
          break;
        }

        const nextPath = parentPath.getSibling(parentPath.key + 1);
        if (nextPath.node) {
          if (nextPath.isReturnStatement()) {
            nextPath.pushContext(path.context);
            nextPath.visit();
            nextPath.popContext();
            if (parentPath.getSibling(parentPath.key + 1).node) {
              noNext = false;
              break;
            }
          } else {
            noNext = false;
            break;
          }
        }

        parentPath = parentPath.parentPath;
      }

      if (noNext) {
        removeOrVoid(path);
      }
    },

    ConditionalExpression(path) {
      const { node } = path;
      const evaluateTest = evaluateTruthy(path.get("test"));
      if (evaluateTest === true) {
        path.replaceWith(node.consequent);
      } else if (evaluateTest === false) {
        path.replaceWith(node.alternate);
      }
    },

    SwitchStatement: {
      exit(path) {
        const discriminantPath = path.get("discriminant");
        const evaluated = evaluate(discriminantPath, { tdz: this.tdz });

        if (!evaluated.confident) return;

        // the simplify transformation might have brought in the previous
        // expressions into the switch's test expression and instead of
        // bailing out of impure path, we collect the impurities of it's
        // a sequence expression and bail out if the primary test itself
        // is impure
        let beforeTest = [];
        if (t.isSequenceExpression(discriminantPath.node)) {
          const expressions = discriminantPath.get("expressions");
          const lastExpression = expressions[expressions.length - 1];
          if (!lastExpression.isPure()) {
            return;
          }

          beforeTest = [
            t.expressionStatement(
              t.sequenceExpression(
                expressions
                  .slice(0, expressions.length - 1)
                  .map(path => path.node)
              )
            )
          ];
        } else if (!discriminantPath.isPure()) {
          return;
        }

        const discriminant = evaluated.value;
        const cases = path.get("cases");

        let matchingCaseIndex = -1;
        let defaultCaseIndex = -1;

        for (let i = 0; i < cases.length; i++) {
          const test = cases[i].get("test");

          // handle default case
          if (test.node === null) {
            defaultCaseIndex = i;
            continue;
          }

          const testResult = evaluate(test, {
            tdz: this.tdz
          });

          // if we are not able to deternine a test during
          // compile time, we terminate immediately
          if (!testResult.confident) return;

          if (testResult.value === discriminant) {
            matchingCaseIndex = i;
            break;
          }
        }

        let result;

        if (matchingCaseIndex === -1) {
          if (defaultCaseIndex === -1) {
            path.skip();
            path.replaceWithMultiple(extractVars(path));
            return;
          } else {
            result = getStatementsUntilBreak(defaultCaseIndex);
          }
        } else {
          result = getStatementsUntilBreak(matchingCaseIndex);
        }

        if (result.bail) return;

        // we extract vars from the entire switch statement
        // and there will be duplicates which
        // will be again removed by DCE
        replaceSwitch([
          ...extractVars(path),
          ...beforeTest,
          ...result.statements
        ]);

        function getStatementsUntilBreak(start) {
          const result = { bail: false, statements: [] };

          for (let i = start; i < cases.length; i++) {
            const consequent = cases[i].get("consequent");

            for (let j = 0; j < consequent.length; j++) {
              const _isBreaking = isBreaking(consequent[j], path);
              if (_isBreaking.bail) {
                result.bail = true;
                return result;
              }
              if (_isBreaking.break) {
                // compute no more
                // exit out of the loop
                return result;
              } else {
                result.statements.push(consequent[j].node);
              }
            }
          }

          return result;
        }

        function replaceSwitch(statements) {
          let isBlockRequired = false;

          for (let i = 0; i < statements.length; i++) {
            if (t.isVariableDeclaration(statements[i], { kind: "let" })) {
              isBlockRequired = true;
              break;
            }
            if (t.isVariableDeclaration(statements[i], { kind: "const" })) {
              isBlockRequired = true;
              break;
            }
          }

          if (isBlockRequired) {
            path.replaceWith(t.BlockStatement(statements));
          } else {
            path.replaceWithMultiple(statements);
          }
        }
      }
    },

    WhileStatement(path) {
      const test = path.get("test");
      const result = evaluate(test, { tdz: this.tdz });
      if (result.confident && test.isPure() && !result.value) {
        path.remove();
      }
    },

    ForStatement(path) {
      const test = path.get("test");
      if (!test.isPure()) return;

      const result = evaluate(test, { tdz: this.tdz });
      if (result.confident) {
        if (result.value) {
          test.remove();
        } else {
          const init = path.get("init");
          if (init.node && !init.isPure()) {
            path.replaceWith(init);
          } else {
            path.remove();
          }
        }
      }
    },

    DoWhileStatement(path) {
      const test = path.get("test");
      const result = evaluate(test, { tdz: this.tdz });
      if (result.confident && test.isPure() && !result.value) {
        const body = path.get("body");

        if (body.isBlockStatement()) {
          const stmts = body.get("body");
          for (const stmt of stmts) {
            const _isBreaking = isBreaking(stmt, path);
            if (_isBreaking.bail || _isBreaking.break) return;
            const _isContinuing = isContinuing(stmt, path);
            if (_isContinuing.bail || isContinuing.continue) return;
          }
          path.replaceWith(body.node);
        } else if (body.isBreakStatement()) {
          const _isBreaking = isBreaking(body, path);
          if (_isBreaking.bail) return;
          if (_isBreaking.break) path.remove();
        } else if (body.isContinueStatement()) {
          return;
        } else {
          path.replaceWith(body.node);
        }
      }
    },

    // Join assignment and definition when in sequence.
    // var x; x = 1; -> var x = 1;
    AssignmentExpression(path) {
      if (
        !path.get("left").isIdentifier() ||
        !path.parentPath.isExpressionStatement()
      ) {
        return;
      }

      const prev = path.parentPath.getSibling(path.parentPath.key - 1);
      if (!(prev && prev.isVariableDeclaration())) {
        return;
      }

      const declars = prev.node.declarations;
      if (
        declars.length !== 1 ||
        declars[0].init ||
        declars[0].id.name !== path.get("left").node.name
      ) {
        return;
      }
      declars[0].init = path.node.right;
      removeOrVoid(path);
    },

    // Remove named function expression name. While this is dangerous as it changes
    // `function.name` all minifiers do it and hence became a standard.
    FunctionExpression(path) {
      if (!this.keepFnName) {
        removeUnreferencedId(path);
      }
    },

    // remove class names
    ClassExpression(path) {
      if (!this.keepClassName) {
        removeUnreferencedId(path);
      }
    },

    // Put the `var` in the left if feasible.
    ForInStatement(path) {
      const left = path.get("left");
      if (!left.isIdentifier()) {
        return;
      }

      const binding = path.scope.getBinding(left.node.name);
      if (!binding) {
        return;
      }

      if (
        binding.scope.getFunctionParent() !== path.scope.getFunctionParent()
      ) {
        return;
      }

      if (!binding.path.isVariableDeclarator()) {
        return;
      }

      if (
        binding.path.parentPath.parentPath.isForInStatement({
          left: binding.path.parent
        })
      ) {
        return;
      }

      // If it has company then it's probably more efficient to keep.
      if (binding.path.parent.declarations.length > 1) {
        return;
      }

      // meh
      if (binding.path.node.init) {
        return;
      }

      removeOrVoid(binding.path);
      path.node.left = t.variableDeclaration("var", [
        t.variableDeclarator(left.node)
      ]);
      binding.path = path.get("left").get("declarations")[0];
    }
  };

  return {
    name: "minify-dead-code-elimination",
    visitor: {
      IfStatement: {
        exit(path, { opts: { tdz = false } = {} }) {
          const consequent = path.get("consequent");
          const alternate = path.get("alternate");
          const test = path.get("test");

          const evalResult = evaluate(test, { tdz });
          const isPure = test.isPure();

          const replacements = [];
          const isRenderFunction = !!path.findParent(p => p.isClassMethod() && t.isIdentifier(p.node.key) && p.node.key.name.startsWith('render')) && containJSXElement(path)
          if (evalResult.confident && !isPure && test.isSequenceExpression()) {
            replacements.push(
              t.expressionStatement(extractSequenceImpure(test))
            );
          }

          // we can check if a test will be truthy 100% and if so then we can inline
          // the consequent and completely ignore the alternate
          //
          //   if (true) { foo; } -> { foo; }
          //   if ("foo") { foo; } -> { foo; }
          //
          if (evalResult.confident && evalResult.value) {
            path.replaceWithMultiple([
              ...replacements,
              ...toStatements(consequent, isRenderFunction),
              ...extractVars(alternate)
            ]);
            return;
          }

          // we can check if a test will be falsy 100% and if so we can inline the
          // alternate if there is one and completely remove the consequent
          //
          //   if ("") { bar; } else { foo; } -> { foo; }
          //   if ("") { bar; } ->
          //
          if (evalResult.confident && !evalResult.value) {
            if (alternate.node) {
              path.replaceWithMultiple([
                ...replacements,
                ...toStatements(alternate, isRenderFunction),
                ...extractVars(consequent)
              ]);
              return;
            } else {
              path.replaceWithMultiple([
                ...replacements,
                ...extractVars(consequent)
              ]);
            }
          }

          // remove alternate blocks that are empty
          //
          //   if (foo) { foo; } else {} -> if (foo) { foo; }
          //
          if (alternate.isBlockStatement() && !alternate.node.body.length) {
            alternate.remove();
            // For if-statements babel-traverse replaces with an empty block
            path.node.alternate = null;
          }

          // if the consequent block is empty turn alternate blocks into a consequent
          // and flip the test
          //
          //   if (foo) {} else { bar; } -> if (!foo) { bar; }
          //
          if (
            consequent.isBlockStatement() &&
            !consequent.node.body.length &&
            alternate.isBlockStatement() &&
            alternate.node.body.length
          ) {
            consequent.replaceWith(alternate.node);
            alternate.remove();
            // For if-statements babel-traverse replaces with an empty block
            path.node.alternate = null;
            test.replaceWith(t.unaryExpression("!", test.node, true));
          }
        }
      },

      EmptyStatement(path) {
        if (path.parentPath.isBlockStatement() || path.parentPath.isProgram()) {
          path.remove();
        }
      },

      Program: {
        exit(
          path,
          {
            opts: {
              // set defaults
              optimizeRawSize = false,
              keepFnName = false,
              keepClassName = false,
              keepFnArgs = false,
              tdz = false
            } = {}
          } = {}
        ) {
          (traverse.clearCache || traverse.cache.clear)();
          path.scope.crawl();

          markEvalScopes(path);

          // We need to run this plugin in isolation.
          path.traverse(main, {
            functionToBindings: new Map(),
            optimizeRawSize,
            keepFnName,
            keepClassName,
            keepFnArgs,
            tdz
          });
        }
      }
    }
  };

  function toStatements(path, isRenderFunction) {
    const { node } = path;
    if (path.isBlockStatement()) {
      if (isRenderFunction) {
        return node.body
      }
      let hasBlockScoped = false;

      for (let i = 0; i < node.body.length; i++) {
        const bodyNode = node.body[i];
        if (t.isBlockScoped(bodyNode)) {
          hasBlockScoped = true;
        }
      }

      if (!hasBlockScoped) {
        return node.body;
      }
    }
    return [node];
  }

  // Extracts vars from a path
  // Useful for removing blocks or paths that can contain
  // variable declarations inside them
  // Note:
  // drops are inits
  // extractVars({ var x = 5, y = x }) => var x, y;
  function extractVars(path) {
    const declarators = [];

    if (path.isVariableDeclaration({ kind: "var" })) {
      for (const decl of path.node.declarations) {
        const bindingIds = Object.keys(t.getBindingIdentifiers(decl.id));

        declarators.push(
          ...bindingIds.map(name => t.variableDeclarator(t.identifier(name)))
        );
      }
    } else {
      path.traverse({
        VariableDeclaration(varPath) {
          if (!varPath.isVariableDeclaration({ kind: "var" })) return;

          if (!isSameFunctionScope(varPath, path)) return;

          for (const decl of varPath.node.declarations) {
            const bindingIds = Object.keys(t.getBindingIdentifiers(decl.id));
            declarators.push(
              ...bindingIds.map(name =>
                t.variableDeclarator(t.identifier(name))
              )
            );
          }
        }
      });
    }

    if (declarators.length <= 0) return [];

    return [t.variableDeclaration("var", declarators)];
  }

  function replace(path, options) {
    const { replacement, replacementPath, scope, binding } = options;

    // Same name, different binding.
    if (scope.getBinding(path.node.name) !== binding) {
      return;
    }

    // We don't want to move code around to different scopes because:
    // 1. Original bindings that is referenced could be shadowed
    // 2. Moving defintions to potentially hot code is bad
    if (scope !== path.scope) {
      if (t.isClass(replacement) || t.isFunction(replacement)) {
        return;
      }

      let bail = false;
      traverse(
        replacement,
        {
          Function(path) {
            if (bail) {
              return;
            }
            bail = true;
            path.stop();
          }
        },
        scope
      );

      if (bail) {
        return;
      }
    }

    // Avoid recursion.
    if (path.find(({ node }) => node === replacement)) {
      return;
    }

    // https://github.com/babel/minify/issues/611
    // this is valid only for FunctionDeclaration where we convert
    // function declaration to expression in the next step
    if (replacementPath.isFunctionDeclaration()) {
      const fnName = replacementPath.get("id").node.name;
      for (let name in replacementPath.scope.bindings) {
        if (name === fnName) {
          return;
        }
      }
    }

    // https://github.com/babel/minify/issues/130
    if (!t.isExpression(replacement)) {
      t.toExpression(replacement);
    }

    // We don't remove fn name here, we let the FnExpr & ClassExpr visitors
    // check its references and remove unreferenced ones
    // if (t.isFunction(replacement)) {
    //   replacement.id = null;
    // }

    path.replaceWith(replacement);
    return true;
  }

  function updateReferences(fnToDeletePath) {
    if (!fnToDeletePath.isFunction()) {
      return;
    }

    fnToDeletePath.traverse({
      ReferencedIdentifier(path) {
        const { node, scope } = path;
        const binding = scope.getBinding(node.name);

        if (
          !binding ||
          !binding.path.isFunction() ||
          binding.scope === scope ||
          !binding.constant
        ) {
          return;
        }

        const index = binding.referencePaths.indexOf(path);
        if (index === -1) {
          return;
        }
        binding.references--;
        binding.referencePaths.splice(index, 1);
        if (binding.references === 0) {
          binding.referenced = false;
        }

        if (binding.references <= 1 && binding.scope.path.node) {
          binding.scope.path.node[shouldRevisit] = true;
        }
      }
    });
  }

  function removeUnreferencedId(path) {
    const id = path.get("id").node;
    if (!id) {
      return;
    }

    const { node, scope } = path;
    const binding = scope.getBinding(id.name);

    // Check if shadowed or is not referenced.
    if (binding && (binding.path.node !== node || !binding.referenced)) {
      node.id = null;
    }
  }

  // path1 -> path2
  // is path1 an ancestor of path2
  function isAncestor(path1, path2) {
    return !!path2.findParent(parent => parent === path1);
  }

  function isSameFunctionScope(path1, path2) {
    return path1.scope.getFunctionParent() === path2.scope.getFunctionParent();
  }

  function isBreaking(stmt, path) {
    return isControlTransfer(stmt, path, "break");
  }

  function isContinuing(stmt, path) {
    return isControlTransfer(stmt, path, "continue");
  }

  // tells if a "stmt" is a break/continue statement
  function isControlTransfer(stmt, path, control = "break") {
    const { [control]: type } = {
      break: "BreakStatement",
      continue: "ContinueStatement"
    };
    if (!type) {
      throw new Error("Can only handle break and continue statements");
    }
    const checker = `is${type}`;

    if (stmt[checker]()) {
      return _isControlTransfer(stmt, path);
    }

    let isTransferred = false;
    let result = {
      [control]: false,
      bail: false
    };

    stmt.traverse({
      [type](cPath) {
        // if we already detected a break/continue statement,
        if (isTransferred) return;

        result = _isControlTransfer(cPath, path);

        if (result.bail || result[control]) {
          isTransferred = true;
        }
      }
    });

    return result;

    function _isControlTransfer(cPath, path) {
      const label = cPath.get("label");

      if (label.node !== null) {
        // labels are fn scoped and not accessible by inner functions
        // path is the switch statement
        if (!isSameFunctionScope(path, cPath)) {
          // we don't have to worry about this break statement
          return {
            break: false,
            bail: false
          };
        }

        // here we handle the break labels
        // if they are outside switch, we bail out
        // if they are within the case, we keep them
        let labelPath;
        if (path.scope.getLabel) {
          labelPath = getLabel(label.node.name, path);
        } else {
          labelPath = path.scope.getBinding(label.node.name).path;
        }
        const _isAncestor = isAncestor(labelPath, path);

        return {
          bail: _isAncestor,
          [control]: _isAncestor
        };
      }

      // set the flag that it is indeed breaking
      let isCTransfer = true;

      // this flag is to capture
      // switch(0) { case 0: while(1) if (x) break; }
      let possibleRunTimeControlTransfer = false;

      // and compute if it's breaking the correct thing
      let parent = cPath.parentPath;

      while (parent !== stmt.parentPath) {
        // loops and nested switch cases
        if (parent.isLoop() || parent.isSwitchCase()) {
          // invalidate all the possible runtime breaks captured
          // while (1) { if (x) break; }
          possibleRunTimeControlTransfer = false;

          // and set that it's not breaking our switch statement
          isCTransfer = false;
          break;
        }
        //
        // this is a special case and depends on
        // the fact that SwitchStatement is handled in the
        // exit hook of the traverse
        //
        // switch (0) {
        //   case 0: if (x) break;
        // }
        //
        // here `x` is runtime only.
        // in this case, we need to bail out. So we depend on exit hook
        // of switch so that, it would have visited the IfStatement first
        // before the SwitchStatement and would have removed the
        // IfStatement if it was a compile time determined
        //
        if (parent.isIfStatement()) {
          possibleRunTimeControlTransfer = true;
        }
        parent = parent.parentPath;
      }

      return {
        [control]: possibleRunTimeControlTransfer || isCTransfer,
        bail: possibleRunTimeControlTransfer
      };
    }
  }

  // things that are hoisted
  function canExistAfterCompletion(path) {
    return (
      path.isFunctionDeclaration() ||
      path.isVariableDeclaration({ kind: "var" })
    );
  }

  function getLabel(name, _path) {
    let label,
      path = _path;
    do {
      label = path.scope.getLabel(name);
      if (label) {
        return label;
      }
    } while ((path = path.parentPath));
    return null;
  }

  function hasLoopParent(path) {
    let parent = path;
    do {
      if (parent.isLoop()) {
        return true;
      }
    } while ((parent = parent.parentPath));
    return false;
  }

  function extractSequenceImpure(seq) {
    const expressions = seq.get("expressions");
    const result = [];
    for (let i = 0; i < expressions.length; i++) {
      if (!expressions[i].isPure()) {
        result.push(expressions[i].node);
      }
    }
    return t.sequenceExpression(result);
  }
};