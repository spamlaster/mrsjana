import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

// Lets Node tests import app source directly: each .ts/.tsx file is compiled to a data: URL, relative
// imports are followed, CSS imports are dropped, and packages (react, react-dom/server) come from
// node_modules. `overrides` swaps a specifier for another module URL, e.g. a stub.
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const require = createRequire(path.join(root, 'package.json'))

export function createLoader({ overrides = {} } = {}) {
  const urls = new Map()
  const loading = new Set()

  function resolveFile(from, spec) {
    const base = path.resolve(path.dirname(from), spec)
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
    }
    throw new Error(`Cannot resolve ${spec} from ${from}`)
  }

  function resolve(from, spec) {
    if (spec in overrides) return overrides[spec]
    if (spec.startsWith('.')) return url(resolveFile(from, spec))
    return pathToFileURL(require.resolve(spec)).href
  }

  function url(file) {
    const full = path.resolve(root, file)
    if (urls.has(full)) return urls.get(full)
    if (loading.has(full)) throw new Error(`Import cycle through ${full}`)
    loading.add(full)
    const compiled = ts.transpileModule(fs.readFileSync(full, 'utf8'), {
      fileName: full,
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText
    const source = compiled
      .replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm, '')
      .replace(/(\bfrom\s+|^import\s+)(['"])([^'"]+)\2/gm, (_, before, _quote, spec) => `${before}${JSON.stringify(resolve(full, spec))}`)
    const result = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
    loading.delete(full)
    urls.set(full, result)
    return result
  }

  return { url, load: file => import(url(file)) }
}
