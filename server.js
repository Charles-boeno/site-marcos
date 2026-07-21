const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONTATOS_DIR = path.join(__dirname, 'data', 'contatos');

fs.mkdirSync(CONTATOS_DIR, { recursive: true });

app.use(express.json());
app.use(express.static(__dirname));

function sanitizeFileName(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 40) || 'contato';
}

app.post('/api/contato', (req, res) => {
  const { nome, telefone, email, mensagem } = req.body;

  if (!nome?.trim() || !telefone?.trim() || !mensagem?.trim()) {
    return res.status(400).json({ ok: false, erro: 'Preencha nome, telefone e mensagem.' });
  }

  const data = new Date();
  const registro = {
    id: data.toISOString(),
    nome: nome.trim(),
    telefone: telefone.trim(),
    email: email?.trim() || '',
    mensagem: mensagem.trim(),
    data: data.toISOString()
  };

  const stamp = data.toISOString().replace(/[:.]/g, '-');
  const arquivo = `${stamp}_${sanitizeFileName(nome)}.json`;
  const caminho = path.join(CONTATOS_DIR, arquivo);

  try {
    fs.writeFileSync(caminho, JSON.stringify(registro, null, 2), 'utf8');
    res.json({ ok: true, arquivo });
  } catch (err) {
    console.error('Erro ao salvar contato:', err);
    res.status(500).json({ ok: false, erro: 'Não foi possível salvar o contato.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Contatos salvos em: ${CONTATOS_DIR}`);
});
