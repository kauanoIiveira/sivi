import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyTransfer } from '../../scripts/verify-transfer.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
test('portable verification detects modified and missing files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sivi-transfer-'));
  await writeFile(join(root, 'README.md'), 'SIVI');
  await writeFile(join(root, 'SHA256SUMS.txt'), `\uFEFF${digest('SIVI')}  README.md\r\n`);
  assert.deepEqual(await verifyTransfer(root), { files: 1, failures: [] });
  await writeFile(join(root, 'README.md'), 'Alterado');
  assert.deepEqual((await verifyTransfer(root)).failures, ['README.md: conteudo diferente']);
  await writeFile(join(root, 'SHA256SUMS.txt'), `${digest('')}  ausente.md\n`);
  assert.deepEqual((await verifyTransfer(root)).failures, ['ausente.md: arquivo ausente']);
});

test('portable verification refuses malformed and escaping manifests', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sivi-transfer-'));
  for (const filename of ['../outside.txt', 'C:/outside.txt', '/outside.txt', 'docs/../outside.txt', 'docs\\file.txt']) {
    await writeFile(join(root, 'SHA256SUMS.txt'), `${digest('')}  ${filename}`);
    await assert.rejects(verifyTransfer(root), /Caminho invalido/);
  }
  await writeFile(join(root, 'SHA256SUMS.txt'), '');
  await assert.rejects(verifyTransfer(root), /Manifesto vazio/);
  await writeFile(join(root, 'SHA256SUMS.txt'), 'bad entry');
  await assert.rejects(verifyTransfer(root), /Linha invalida/);
  await writeFile(join(root, 'SHA256SUMS.txt'), `${digest('')}  README.md\n${digest('')}  README.md`);
  await assert.rejects(verifyTransfer(root), /duplicado/);
});
