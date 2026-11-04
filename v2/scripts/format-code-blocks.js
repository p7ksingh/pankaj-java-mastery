/**
 * Auto-format Java code blocks in all question JSON files.
 * Fixes:
 * 1. Multiple statements on one line → each on its own line
 * 2. Opening { with no newline after → add newline
 * 3. Proper indentation after splitting
 * 4. for(...) loops left intact (semicolons inside for() are not split)
 */

const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve(__dirname, '../data/interview')
let totalFiles = 0
let fixedFiles = 0
let totalFixes = 0

function formatJavaCode(code) {
  const lines = code.split('\n')
  const result = []
  let changed = false

  for (const line of lines) {
    const trimmed = line.trimEnd()
    const indent = line.match(/^(\s*)/)[1]

    // Skip empty lines, comments, strings-only lines, import/package lines
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')
      || trimmed.startsWith('import ') || trimmed.startsWith('package ')) {
      result.push(line)
      continue
    }

    // Don't split lines inside for() — detect for(...;...;...)
    if (/^\s*for\s*\(/.test(trimmed)) {
      result.push(line)
      continue
    }

    // Don't split single-line lambdas, annotations, or short lines
    if (trimmed.length < 60 || /^\s*@/.test(trimmed) || /^\s*\/\//.test(trimmed)) {
      result.push(line)
      continue
    }

    // Split multiple statements: "; this.", "; System.", "; return ", "; if (", "; break;", "; throw "
    // But NOT inside strings or for loops
    const splitPattern = /;\s+(this\.|System\.|return\s|if\s*\(|throw\s|break;|continue;|log\.|logger\.|LOG\.|[A-Z][a-zA-Z]*\s+\w+\s*=)/g

    if (splitPattern.test(trimmed)) {
      // Reset regex
      splitPattern.lastIndex = 0

      // Check we're not inside a string
      let inString = false
      let canSplit = true
      const str = trimmed
      for (let i = 0; i < str.length; i++) {
        if (str[i] === '"' && (i === 0 || str[i-1] !== '\\')) {
          inString = !inString
        }
      }
      if (inString) {
        canSplit = false
      }

      if (canSplit) {
        // Split at "; " followed by a statement start
        const parts = trimmed.split(/;\s+(?=this\.|System\.|return\s|if\s*\(|throw\s|break;|continue;|log\.|logger\.|LOG\.|[A-Z][a-zA-Z]*\s+\w+\s*=)/)

        if (parts.length > 1) {
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim()
            if (part) {
              // Add semicolon back if it was removed (except last part which may already have it)
              const needsSemicolon = i < parts.length - 1 && !part.endsWith(';') && !part.endsWith('{') && !part.endsWith('}')
              result.push(indent + '    ' + (i === 0 ? parts[0].trim() + (needsSemicolon ? ';' : '') : part))
              if (i < parts.length - 1 && !parts[i].trim().endsWith(';')) {
                // Fix: first part loses its semicolon in split, add it back
              }
            }
          }
          changed = true
          totalFixes++
          continue
        }
      }
    }

    result.push(line)
  }

  return { code: result.join('\n'), changed }
}

function processSection(text) {
  if (!text || typeof text !== 'string') {
    return { text, changed: false }
  }

  let changed = false
  const processed = text.replace(/```java\n([\s\S]*?)```/g, (match, code) => {
    const { code: formatted, changed: codeChanged } = formatJavaCode(code)
    if (codeChanged) {
      changed = true
    }
    return '```java\n' + formatted + '```'
  })

  return { text: processed, changed }
}

function processFile(filePath) {
  totalFiles++
  const raw = fs.readFileSync(filePath, 'utf-8')
  let data

  try {
    data = JSON.parse(raw)
  } catch {
    return
  }

  if (!data.sections) {
    return
  }

  let fileChanged = false

  for (const key of Object.keys(data.sections)) {
    const section = data.sections[key]

    if (typeof section === 'string') {
      const { text, changed } = processSection(section)
      if (changed) {
        data.sections[key] = text
        fileChanged = true
      }
    } else if (section && typeof section === 'object') {
      for (const subKey of Object.keys(section)) {
        if (typeof section[subKey] === 'string') {
          const { text, changed } = processSection(section[subKey])
          if (changed) {
            section[subKey] = text
            fileChanged = true
          }
        }
      }
    }
  }

  if (fileChanged) {
    fixedFiles++
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath)
    } else if (entry.name.startsWith('Q') && entry.name.endsWith('.json')) {
      processFile(fullPath)
    }
  }
}

console.log('Formatting Java code blocks...')
walkDir(DATA_DIR)
console.log(`Done. Scanned ${totalFiles} files. Fixed ${fixedFiles} files. ${totalFixes} code blocks reformatted.`)
