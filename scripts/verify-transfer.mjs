import { createHash } from 'node:crypto';
import { readFile, realpath, stat } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function verifyTransfer(directory) {
  const root = await realpath(resolve(directory));
  const manifest = (await readFile(resolve(root, 'SHA256SUMS.txt'), 'utf8')).replace(/^\uFEFF/, '');
  const entries = manifest.split(/\r?\n/).filter(line => line.trim());
  if (!entries.length) throw new Error('Manifesto vazio.');
  const failures = [];
  const seen = new Set();
  for (const line of entries) {
    const match = /^([a-f0-9]{64})  (.+)$/i.exec(line);
    if (!match) throw new Error('Linha invalida no manifesto.');
    const [, expected, filename] = match;
    if (isAbsolute(filename) || filename.includes('\\') || filename.split('/').some(part => !part || part === '..' || part === '.') || filename.includes(':')) {
      throw new Error(`Caminho invalido no manifesto: ${filename}`);
    }
    if (seen.has(filename.toLowerCase())) throw new Error(`Arquivo duplicado no manifesto: ${filename}`);
    seen.add(filename.toLowerCase());
    try {
      const path = await realpath(resolve(root, filename));
      const local = relative(root, path);
      if (local === '..' || local.startsWith(`..${sep}`) || isAbsolute(local)) throw new Error('caminho fora da copia');
      if (!(await stat(path)).isFile()) throw new Error('nao e arquivo');
      const actual = createHash('sha256').update(await readFile(path)).digest('hex');
      if (actual !== expected.toLowerCase()) failures.push(`${filename}: conteudo diferente`);
    } catch (error) {
      failures.push(`${filename}: ${error.code === 'ENOENT' ? 'arquivo ausente' : error.message}`);
    }
  }
  return { files: entries.length, failures };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await verifyTransfer(process.argv[2] ?? '.');
    if (result.failures.length) {
      process.stderr.write(`${result.failures.join('\n')}\n`);
      process.exitCode = 1;
    } else process.stdout.write(`Integridade confirmada: ${result.files} arquivos.\n`);
  } catch (error) {
    process.stderr.write(`Nao foi possivel verificar: ${error.message}\n`);
    process.exitCode = 1;
  }
}
