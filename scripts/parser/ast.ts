import * as ts from "typescript"

export interface DocEntry {
  name?: string
  kind?: ts.SyntaxKind
  flags?: ts.SymbolFlags
  fileName?: string
  documentation?: string
  jsTags?: ts.JSDocTagInfo[]
  type?: string
  constructors?: DocEntry[]
  parameters?: DocEntry[]
  returnType?: string
  members?: DocEntry[]
  exports?: DocEntry[]
  children?: DocEntry[]
  declarations?: DocEntry[]
  symbol?: DocEntry
}

export function generateDocumentation(
  filepaths: string[],
  options: ts.CompilerOptions,
  output: DocEntry[] = []
): DocEntry[] {
  const program = ts.createProgram(filepaths, options)
  const checker = program.getTypeChecker()
  // const sourceFiles = program.getSourceFiles()
  // const mainFile = sourceFiles.find(e => e.fileName === filepath)

  // if (mainFile) {
  //   output[mainFile.fileName] = []
  //   ts.forEachChild(mainFile, (n) => visitAST(n, output[mainFile.fileName]))
  //   const referencedFiles = mainFile.referencedFiles
  //   for (let index = 0; index < referencedFiles.length; index++) {
  //     const referencedFileName = referencedFiles[index].fileName;
  //     const referencedFile = sourceFiles.find(e => e.fileName.search(referencedFileName) > -1)

  //     if (referencedFile) {
  //       output[referencedFile.fileName] = []
  //       ts.forEachChild(referencedFile, (n) => visitAST(n, output[referencedFile.fileName]))
  //     }
  for (const sourceFile of program.getSourceFiles()) {
    // if (!sourceFile.isDeclarationFile) {}
    if (filepaths[0] === sourceFile.fileName) {
      ts.forEachChild(sourceFile, (n) => visitAST(n, output))
    }
  }

  return output

  function visitAST(node: ts.Node, o: DocEntry[]) {
    // Only consider exported nodes
    if (!isNodeExported(node as ts.Declaration) || node.kind === ts.SyntaxKind.EndOfFileToken || node.kind === ts.SyntaxKind.DeclareKeyword
        || ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node) || ts.isImportClause(node)
        || ts.isExportAssignment(node) || ts.isExportDeclaration(node)
        || ts.isExpressionStatement(node) || ts.isEmptyStatement(node)
        || node.kind === ts.SyntaxKind.ExportKeyword) {
      return
    }

    if (ts.isVariableDeclaration(node) || ts.isClassDeclaration(node) && node.name) {
      const symbol = checker.getSymbolAtLocation(node)
      symbol && o.push(serializeClass(symbol))
    } else if (ts.isFunctionDeclaration(node)) {
      const signature = checker.getSignatureFromDeclaration(node)
      signature && o.push(serializeSignature(signature, node.name && ts.idText(node.name)))
    } else if (ts.isInterfaceDeclaration(node)) {
      const symbol = checker.getTypeAtLocation(node).getSymbol()
      symbol && o.push(serializeType(symbol, undefined, 'InterfaceDeclaration'))
    } else if (ts.isTypeAliasDeclaration(node)) {
      const symbol = checker.getTypeAtLocation(node).getSymbol()
      if (symbol) {
        o.push(serializeType(symbol, ts.idText(node.name)))
      } else {
        // @ts-ignore
        const sym = node.symbol, type = node.type && node.type.types.map(e => checker.typeToString(checker.getTypeFromTypeNode(e))).join(' | ')
        o.push(
          serializeSymbol(sym, sym.getName(), type)
        )
      }
    } else if (ts.isEnumDeclaration(node)) {
      const symbol = checker.getTypeAtLocation(node).getSymbol()
      symbol && o.push(serializeType(symbol))
    } else if (ts.isIdentifier(node)) {
      const symbol = checker.getTypeAtLocation(node).getSymbol()
      symbol && o.push(serializeType(symbol))
    } else if (ts.isModuleDeclaration(node) || ts.isVariableStatement(node)) {
      // This is a namespace, visitAST its children
      ts.forEachChild(node, (n) => visitAST(n, o))
    } else if (ts.isModuleBlock(node)) {
      // This is a namespace, visitAST its children
      const out: DocEntry = {
        name: ts.isIdentifier(node.parent.name) ? ts.idText(node.parent.name) : '',
        kind: node.kind,
        children: []
      }
      ts.forEachChild(node, (n) => visitAST(n, out.children!))
      o.push(out)
    } else if (ts.isVariableDeclarationList(node)) {
      node.declarations.forEach(d => {
        const symbol = d['symbol']
        symbol && o.push(serializeType(symbol))
      })
    } else {
      console.warn(`WARN: Statement kind ${node.kind} is missing parse!\n\n${node.getText()}`)
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol, name?: string, type?: string): DocEntry {
    const declarations: DocEntry[] = [];
    (symbol.getDeclarations() || []).map(
      d => checker.getSignaturesOfType(checker.getTypeAtLocation(d), ts.SignatureKind.Call).map(
        e => declarations.push(serializeSignature(e))
      )
    )

    return {
      jsTags: symbol.getJsDocTags(),
      name: name || symbol.getName(),
      flags: symbol.flags,
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: type || checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      ),
      declarations
    }
  }

  /** Serialize a class symbol information */
  function serializeClass(symbol: ts.Symbol) {
    const details = serializeSymbol(symbol)
    // Get the construct signatures
    const constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!
    )
    const signatures = constructorType.getConstructSignatures()
    details.constructors = signatures.map(n => serializeSignature(n))
    return details
  }

  /** Serialize a types (type or interface) symbol information */
  function serializeType(symbol: ts.Symbol, name?: string, type?:  keyof typeof ts.SyntaxKind): DocEntry {
    // console.log(type, Object.keys(symbol))
    const doc: DocEntry = serializeSymbol(symbol, name, type)
    symbol.exports && symbol.exports.forEach((value) => {
      if (!doc.exports) doc.exports = []
      doc.exports.push(serializeSymbol(value))
    })
    symbol.members && symbol.members.forEach((value) => {
      if (!doc.members) doc.members = []
      doc.members.push(serializeSymbol(value))
    })
    return doc
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature, name?: string) {
    const typeParameters = signature.getTypeParameters() || []

    return {
      name,
      jsTags: signature.getJsDocTags(),
      documentation: ts.displayPartsToString(signature.getDocumentationComment(checker)),
      parameters: signature.getParameters().map((e, i) =>
        serializeSymbol(e, undefined, typeParameters[i] && checker.typeToString(typeParameters[i]))),
      returnType: checker.typeToString(signature.getReturnType())
    }
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Declaration): boolean {
    return (
      (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent/*  && node.parent.kind === ts.SyntaxKind.SourceFile */)
    )
  }
}
