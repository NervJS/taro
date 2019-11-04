import * as ts from "typescript"

export interface DocEntry {
  name?: string | ts.__String
  fileName?: string
  documentation?: string
  jsTags?: ts.JSDocTagInfo[]
  type?: string
  constructors?: DocEntry[]
  parameters?: DocEntry[]
  returnType?: string
  members?: DocEntry[]
  exports?: DocEntry[]
}

export function generateDocumentation(
  filepath: string,
  options: ts.CompilerOptions
): DocEntry[] {
  const program = ts.createProgram([filepath], options)
  const checker = program.getTypeChecker()

  const output: DocEntry[] = []

  for (const sourceFile of program.getSourceFiles()) {
    // if (!sourceFile.isDeclarationFile) {}
    if (filepath === sourceFile.fileName) {
      ts.forEachChild(sourceFile, visitAST)
    }
  }

  return output

  function visitAST(node: ts.Node) {
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
      symbol && output.push(serializeClass(symbol))
    } else if (ts.isFunctionDeclaration(node)) {
      const signature = checker.getSignatureFromDeclaration(node)
      signature && output.push(serializeSignature(signature))
    } else if (ts.isInterfaceDeclaration(node)) {
      const symbol = checker.getTypeAtLocation(node).getSymbol()
      symbol && output.push(serializeType(symbol, undefined, 'InterfaceDeclaration'))
    } else if (ts.isTypeAliasDeclaration(node)) {
      const symbol = checker.getTypeAtLocation(node).getSymbol()
      symbol && output.push(serializeType(symbol, ts.idText(node.name), 'TypeAliasDeclaration'))
    } else if (ts.isEnumDeclaration(node)) {
      const symbol = checker.getTypeAtLocation(node).getSymbol()
      symbol && output.push(serializeType(symbol))
    } else if (ts.isIdentifier(node)) {
      const symbol = checker.getTypeAtLocation(node).getSymbol()
      symbol && output.push(serializeType(symbol))
    } else if (ts.isModuleDeclaration(node) || ts.isModuleBlock(node) || ts.isVariableStatement(node)) {
      // This is a namespace, visitAST its children
      ts.forEachChild(node, visitAST)
    } else if (ts.isVariableDeclarationList(node)) {
      node.declarations.forEach(d => {
        const symbol = d['symbol']
        symbol && output.push(serializeType(symbol))
      })
    } else {
      console.log(`WARN: Statement kind ${node.kind} is missing parse!\n\n${node.getText()}`)
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol, name?: string, type?: string): DocEntry {
    return {
      jsTags: symbol.getJsDocTags(),
      name: name || symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: type || checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      )
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
    details.constructors = signatures.map(serializeSignature)
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
  function serializeSignature(signature: ts.Signature) {
    const typeParameters = signature.getTypeParameters() || []
    return {
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
